Bluebird.provider("Bluebird.States",function(){function a(a){var b={name:void 0,template:void 0,templateUrl:void 0,templateProvider:void 0,controller:void 0,controllerProvider:void 0,controllerAs:void 0,parent:void 0,resolve:void 0,url:void 0,views:void 0,"abstract":void 0,onEnter:void 0,onExit:void 0,reloadOnSearch:void 0,data:void 0,params:void 0};_.extend(this,b,a)}"undefined"==typeof Bluebird.States&&console.error(new ReferenceError("Bluebird.States collection is missing."));var b=[];this.compile=function(){return b=[],_.each(Bluebird.States,function(c){var d=new a(c);d.templateUrl=_.isString(d.templateUrl)?"state/"+d.templateUrl:d.templateUrl,b.push(d)},this),this},this.getCollection=function(){return b},this.$get=function(){return this}});