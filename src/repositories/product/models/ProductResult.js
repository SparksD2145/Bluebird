var ProductResult = {
    sku: Number,
    productId: Number,
    name: String,
    source: String,
    type: String,
    startDate: String,
    new: Boolean,
    active: Boolean,
    lowPriceGuarantee: Boolean,
    activeUpdateDate: Date,
    regularPrice: Number,
    salePrice: Number,
    onSale: Boolean,
    planPrice: Number, // nullable
    priceWithPlan: Array, /// @todo NEEED TO DETERMINE THIS DATATYPE
    priceRestriction: String,
    priceUpdateDate: Date,
    digital: Boolean,
    preowned: Boolean,
    carrierPlans: Array, // @todo Need to determine
    technologyCode: String,
    carrierModelNumber: String,
    earlyTerminationFees: Array, // @todo need to determine
    outletCenter: String, // @todo need to determine
    secondaryMarket: String, // @todo need to determine
    frequentlyPurchasedWith: Array,  // @todo need to determine
    accessories: Array, // @todo need to determine
    relatedProducts: Array, // @todo need to add to model -> RelatedProduct[],
    techSupportPlans: Array,  // @todo need to determine
    salesRankShortTerm: Number,
    salesRankMediumTerm: Number,
    salesRankLongTerm: Number,
    bestSellingRank: Number,
    url: String,
    spin360Url: String,
    mobileUrl: String,
    affiliateUrl: String,
    addToCartUrl: String,
    affiliateAddToCartUrl: String,
    linkShareAffiliateUrl: String,
    linkShareAffiliateAddToCartUrl: String,
    upc: String, // @todo should be a number
    productTemplate: String,
    categoryPath: Array,
    lists: Array, // @todo need to determine
    customerReviewCount: Number,
    customerReviewAverage: String, // @todo needs to be a number
    customerTopRated: Boolean,
    format: String, // @todo need to determine
    freeShipping: Boolean,
    freeShippingEligible: Boolean, //todo redundant
    inStoreAvailability: Boolean,
    inStoreAvailabilityText: String,
    inStoreAvailabilityUpdateDate: Date,
    itemUpdateDate: Date,
    onlineAvailability: Boolean,
    onlineAvailabilityText: String,
    onlineAvailabilityUpdateDate: String,
    releaseDate: String, // @todo should be a date
    shippingCost: Number,
    shipping: Array, // @todo shippingcosts
    specialOrder: Boolean,
    shortDescription: String,
    class: String,
    classId: Number,
    subclass: String,
    subclassId: Number,
    department: String,
    departmentId: Number,
    buybackPlans: Array, // todo need to determine
    protectionPlans: Array, //todo need to determine
    productFamilies: Array, //todo need to determine
    description: String,
    manufacturer: String,
    modelNumber: String,
    image: String, // this is a url
    largeFrontImage: String, // this is a url
    mediumImage: String, // this is a url
    thumbnailImage: String, // this is a url
    largeImage: String, // this is a url
    alternateViewsImage: String, // todo need to determine
    angleImage: String, // todo need to determine
    backViewImage: String, // todo need to determine
    energyGuideImage: String, // todo need to determine
    leftViewImage: String, // todo need to determine
    accessoriesImage: String, // todo need to determine
    remoteControlImage: String, // todo need to determine
    rightViewImage: String, // todo need to determine
    topViewImage: String, // todo need to determine
    condition: String,
    inStorePickup: Boolean,
    friendsAndFamilyPickup: Boolean,
    homeDelivery: Boolean,
    quantityLimit: Number,
    fulfilledBy: String,
    bundledIn: Array, //todo need to determine
    color: String,
    depth: String,
    dollarSavings: Number,
    percentSavings: String, // todo needs to be a number
    tradeInValue: String, //todo needs to be a number
    height: String,
    orderable: String,
    weight: String,
    shippingWeight: String,
    width: String,
    warrantyLabor: String,
    warrantyParts: String,
    longDescription: String,
    includedItemList: Array,
    marketplace: Boolean,
    listingId: String,
    sellerId: String,
    shippingRestrictions: String,
    iphoneAccessory: Boolean
};
module.exports = ProductResult;