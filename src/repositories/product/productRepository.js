/**
 * @file Product Repository
 * @author Thomas Ibarra <sparksd2145.dev@gmail.com>
 */

var _ = require('underscore'),
    moment = require('moment'),
    rest = require('restler'),
    mongoose = require('mongoose');

var Product = require('./models/Product');
var apiKey = "";

/**
 * Handles product queries.
 * @requires module:express
 * @requires module:underscore
 * @type {exports}
 * @returns {object}
 */
function ProductRepository(app) {
    this.app = app;

    apiKey = this.app.get('config').bbyOpen.key;
    this.productMaxAge = moment.duration({
        days: 1
    });

    var dbAddress = this.app.get('config').database.address;
    var db = mongoose.connect(dbAddress);
}
ProductRepository.prototype.query = function(queryString, useExtendedSearch, next){
    if(_.isEmpty(queryString)) return false;

    var queries = this.utilities.parseQuery(queryString);
    var builtQuery = this.buildQuery(queries);

    if(useExtendedSearch !== true){
        this.retrieve(builtQuery.db, next);
    } else {
        this.runBBYProductQuery(builtQuery.bby, next);
    }
};
ProductRepository.prototype.buildQuery = function(queryArray){
    var dbQueries = [];
    var bbyOpenQueries = [];

    var dbAggregateQuery = function(queries){
        return [
            { $match: { $or: queries } },
            { $sort: {
                'marketplace.isMarketplaceItem': 1,
                'availability.hasInStoreAvailability': 1
                }
            }
        ];
    };

    _.each(queryArray, function(query, index, list){
        if(query instanceof UPC){
            dbQueries.push({'identifiers.upc': query.value });

            var bbyForm = index < list.length - 1 ? query.bbyQueryForm + '|' : query.bbyQueryForm;
            bbyOpenQueries.push(bbyForm);
        } else if (query instanceof SKU){
            dbQueries.push({'identifiers.sku': query.value });

            var bbyForm = index < list.length - 1 ? query.bbyQueryForm + '|' : query.bbyQueryForm;
            bbyOpenQueries.push(bbyForm);
        } else if(query instanceof TEXT) {
            var tokens = query.value.split(' ');

            var subQueries = [];
            var andQuery = function(detailsArray){
                return { $and: detailsArray };
            };

            _.each(tokens, function (token) {
                subQueries.push({
                    keywords: { $regex: new RegExp("^" + token + ".*", "gi") }
                });
            });

            dbQueries.push(andQuery(subQueries));

            _.each(tokens, function (token, index, list) {
                list[index] = '(' + "name=" + token + "*" + '|' + "name=" + token + "*" + '&marketplace=true' + ')';
                if (index != 0) list[index] = '&' + list[index];
            });

            var task = tokens.join('');

            var bbyForm = index < list.length - 1 ? task + '|' : task;
            bbyOpenQueries.push(bbyForm);

        }
    });

    return {
        db: dbAggregateQuery(dbQueries),
        bby: bbyOpenQueries.join('')
    };
};
ProductRepository.prototype.runBBYProductQuery = function(query, callback){
    var queryURL = this.app.get('bbyOpenAddress') + 'products(' + query + ')';
    var queryOptions = {
        query: {
            format: 'json',
            pageSize: 100,
            sort: 'marketplace.asc,inStoreAvailability.asc',
            apiKey: apiKey
        }
    };

    var scoped = this;
    rest.get(queryURL, queryOptions).on('complete', function(result){
        // Result returns as Result.products, we want to isolate only "products"
        result = scoped.utilities.convertResult(result["products"]);

        scoped.save(result);
        callback(result);
    });
};
ProductRepository.prototype.runBBYProductAvailabilityQuery = function(query, location, distance, callback){

    if(_.isEmpty(query)) return false;
    if(_.isEmpty(location)) return false;

    var queries = this.utilities.parseQuery(query);
    var builtQuery = this.buildQuery(queries);

    var queryURL = this.app.get('bbyOpenAddress')
        + 'stores(area(' + location + ',' + distance + '))+'
        + 'products(' + builtQuery.bby + ')';

    var queryOptions = {
        query: {
            format: 'json',
            apiKey: apiKey
        }
    };

    var scoped = this;
    rest.get(queryURL, queryOptions).on('complete', function(results){
        // Result returns as stores, we want to isolate only "result.stores"
        var stores = [];

        _.each(results["stores"], function(store){
            var products = [];

            _.each(store["products"], function(product){
                products.push(product.sku);
            });

            store.phoneNumber = store["phone"].replace(/[-]/g, '');
            store["phone"] = 'tel:' + store["phone"].replace(/[-]/g, '');

            store["products"] = products;
            stores.push(store);
        });

        callback(stores);
    });
};
ProductRepository.prototype.retrieve = function(query, callback){
    var maxAge = this.productMaxAge;
    var scope = this;

    return Product
        .aggregate(query)
        .exec(function(err, results){
            if (err instanceof Error) {
                console.error(err);
            }

            var outOfDate = [];
            var upToDate = [];

            _.each(results, function(result){
                var lastUpdate = moment(result.lastUpdated);
                var now = moment();

                if(lastUpdate.isBefore(now.subtract(maxAge))){
                    outOfDate.push(result);
                } else {
                    upToDate.push(result);
                }
            });

            if(!_.isEmpty(outOfDate)){

                // Retrieve the ids of all out of date products and build them as a string query.
                outOfDate = _.pluck(outOfDate, '_id').join(',');

                scope.query(outOfDate, true, function(resultArray){
                    var dataFinal = upToDate.concat(resultArray);

                    return callback(dataFinal);
                });
            } else {
                callback(results);
            }

        });

};
ProductRepository.prototype.save = function(products) {
    var saveSingle = function(product){
        Product.findById(product._id, function(err, result){
            if(err instanceof Error) {
                console.error(err);
                return false;
            }

            if(_.isEmpty(result)) {
                // No product found in database, create new record
                var productN = new Product(product);

                productN
                    .updateLastModified()
                    .generateKeywords()
                    .save(function (err) {
                        console.error(err)
                    });
                return true;
            } else {
                _.extend(result, product);

                result
                    .updateLastModified()
                    .generateKeywords()
                    .save(function(err){ console.error() });

                return true;
            }
        });
    }.bind(this);

    if(_.isArray(products)) {
        _.each(products, function(product){
            return saveSingle(product);
        });
    } else {
        saveSingle(products);
    }

    // return this for chaining
    return this;
};
ProductRepository.prototype.utilities = {};
ProductRepository.prototype.utilities.convertResult = function (productResult) {
    try {
        var productList = [];

        _.each(productResult, function(product){
            productList.push({
                _id: product.sku,
                name: product.name,
                identifiers: {
                    sku: product.sku,
                    productId: product.productId,
                    upc: product.upc,
                    modelNumber: product.modelNumber,
                    manufacturer: product.manufacturer,
                    color: product.color
                },
                descriptions: {
                    description: product.description,
                    shortDescription: product.shortDescription,
                    longDescription: product.longDescription,
                    condition: product.condition
                },
                misc: {
                    categoryPath: product.categoryPath,
                    productTemplate: product.productTemplate,
                    lists: product.lists,
                    format: product.format,
                    includedItemList: product.includedItemList,
                    isIphoneAccessory: product.iphoneAccessory,
                    bundledIn: product.bundledIn,
                    type: product.type
                },
                marketplace: {
                    isMarketplaceItem: product.marketplace,
                    listingId: product.listingId,
                    sellerId: product.sellerId
                },
                classes: {
                    class: product.class,
                    classId: product.classId,
                    subclass: product.subclass,
                    subclassId: product.subclassId,
                    department: product.department,
                    departmentId: product.departmentId
                },
                pricing: {
                    hasLowPriceGuarantee: product.lowPriceGuarantee,
                    activeUpdateDate: product.activeUpdateDate,
                    regularPrice: product.regularPrice,
                    salePrice: product.salePrice,
                    isOnSale: product.onSale,
                    planPrice: product.planPrice,
                    priceWithPlan: product.priceWithPlan,
                    priceRestriction: product.priceRestriction,
                    priceUpdateDate: product.priceUpdateDate,
                    tradeInValue: product.tradeInValue
                },
                media: {
                    isDigital: product.digital,
                    isPreowned: product.preowned
                },
                cellular: {
                    carrierPlans: product.carrierPlans,
                    technologyCode: product.technologyCode,
                    carrierModelNumber: product.carrierModelNumber,
                    earlyTerminationFees: product.earlyTerminationFees
                },
                related: {
                    frequentlyPurchasedWith: product.frequentlyPurchasedWith,
                    accessories: product.accessories,
                    relatedProducts: product.relatedProducts
                },
                plans: {
                    techSupportPlans: product.techSupportPlans,
                    buybackPlans: product.buybackPlans,
                    protectionPlans: product.protectionPlans,
                    productFamilies: product.productFamilies
                },
                ranking: {
                    salesRankShortTerm: product.salesRankShortTerm,
                    salesRankMediumTerm: product.salesRankMediumTerm,
                    salesRankLongTerm: product.salesRankLongTerm,
                    bestSellingRank: product.bestSellingRank
                },
                urls: {
                    url: product.url,
                    spin360Url: product.spin360Url,
                    mobileUrl: product.mobileUrl,
                    affiliateUrl: product.affiliateUrl,
                    addToCartUrl: product.addToCartUrl,
                    affiliateAddToCartUrl: product.affiliateAddToCartUrl,
                    linkShareAffiliateUrl: product.linkShareAffiliateUrl,
                    linkShareAffiliateAddToCartUrl: product.linkShareAffiliateAddToCartUrl
                },
                images: {
                    image: product.image,
                    largeFrontImage: product.largeFrontImage,
                    mediumImage: product.mediumImage,
                    thumbnailImage: product.thumbnailImage,
                    largeImage: product.largeImage,
                    alternateViewsImage: product.alternateViewsImage,
                    angleImage: product.angleImage,
                    backViewImage: product.backViewImage,
                    energyGuideImage: product.energyGuideImage,
                    leftViewImage: product.leftViewImage,
                    accessoriesImage: product.accessoriesImage,
                    remoteControlImage: product.remoteControlImage,
                    rightViewImage: product.rightViewImage,
                    topViewImage: product.topViewImage
                },
                reviews: {
                    customerReviewCount: product.customerReviewCount,
                    customerReviewAverage: product.customerReviewAverage,
                    isCustomerTopRated: product.customerTopRated
                },
                availability: {
                    source: product.source,
                    startDate: product.startDate,
                    isNew: product.new,
                    isActive: product.active,
                    releaseDate: moment(product.releaseDate),
                    hasFreeShipping: product.freeShipping,
                    isFreeShippingEligible: product.freeShippingEligible,
                    shipping: product.shipping,
                    shippingCost: product.shippingCost,
                    isSpecialOrder: product.specialOrder,
                    hasInStorePickup: product.inStorePickup,
                    hasFriendsAndFamilyPickup: product.friendsAndFamilyPickup,
                    hasHomeDelivery: product.homeDelivery,
                    quantityLimit: product.quantityLimit,
                    fulfilledBy: product.fulfilledBy,
                    orderable: product.orderable,
                    hasInStoreAvailability: product.inStoreAvailability,
                    inStoreAvailabilityText: product.inStoreAvailabilityText,
                    inStoreAvailabilityUpdateDate: product.inStoreAvailabilityUpdateDate,
                    itemUpdateDate: product.itemUpdateDate,
                    hasOnlineAvailability: product.onlineAvailability,
                    onlineAvailabilityText: product.onlineAvailabilityText,
                    onlineAvailabilityUpdateDate: product.onlineAvailabilityUpdateDate,
                    shippingRestrictions: product.shippingRestrictions
                },
                savings: {
                    dollarSavings: product.dollarSavings,
                    percentSavings: product.percentSavings
                },
                measurements: {
                    height: product.height,
                    width: product.width,
                    depth: product.depth,
                    weight: product.weight,
                    shippingWeight: product.shippingWeight
                },
                warranty: {
                    warrantyLabor: product.warrantyLabor,
                    warrantyParts: product.warrantyParts
                }
            });
        });

        return productList;

    } catch (e) {
        throw e; // @todo this is bad, fix this
    }

    return null;
};
ProductRepository.prototype.utilities.parseQuery = function(queryString){

    if(_.isUndefined(queryString)) return false;

    var queryTests = function(queryArray) {
        var queriesTyped = [];
        var skuRx = /^[0-9]{7,10}$/;
        var upcRx = /^[0-9]{12}$/;

        _.each(queryArray, function (query) {
            if (skuRx.test(query)) {
                var sku = new SKU(parseInt(query));
                queriesTyped.push(sku);

            } else if (upcRx.test(query)) {
                var upc = new UPC(parseInt(query));
                queriesTyped.push(upc);

            } else {
                var text = new TEXT(query);
                queriesTyped.push(text);
            }
        });

        return queriesTyped;

    };

    var queries = queryString.split(/[;,]\s?/g);

    return queryTests(queries);
};

function QueryType(){ this.value = undefined; this.bbyQueryForm = undefined; }
QueryType.prototype.init = function(value, queryForm){
    this.value = value;
    this.bbyQueryForm = '(' + queryForm + this.value + '|' + queryForm + this.value + '&marketplace=true)';
};

function UPC(upc){ this.init(upc, 'upc='); }
UPC.prototype = new QueryType();

function SKU(sku){ this.init(sku, 'sku='); }
SKU.prototype = new QueryType();

function TEXT(text){ this.init(text, 'name='); }
TEXT.prototype = new QueryType();

module.exports = ProductRepository;