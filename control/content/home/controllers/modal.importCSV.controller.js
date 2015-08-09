'use strict';

(function (angular) {
    angular
        .module('peoplePluginContent')
        .controller('ImportCSVPopupCtrl', ['$scope', '$modalInstance','peopleInfo','FormatConverter','Buildfire','TAG_NAMES', function ($scope, $modalInstance,peopleInfo,FormatConverter,Buildfire,TAG_NAMES) {
            var ImportCSVPopup=this;
            ImportCSVPopup.loading=false;
            var rank=peopleInfo.content.rankOfLastItem || 0;
            ImportCSVPopup.ok = function (linkUrl) {
                ImportCSVPopup.loading=true;
                if(ImportCSVPopup.fileData){
                    var json = JSON.parse(FormatConverter.CSV2JSON(ImportCSVPopup.fileData));
                    var index,value;
                    for(index=0;index<json.length;index++){
                        rank+=10;
                        value=json[index];
                        value.dateCreated=+new Date();
                        value.socialLinks=[];
                        value.rank=rank;
                    }
                    Buildfire.datastore.bulkInsert(json, TAG_NAMES.PEOPLE, function (err, data) {
                        if (err) {
                            console.error('There was a problem while importing the file----',err);
                        }
                        else {
                            console.log('File has been imported----------------------------',data);
                        }
                        $modalInstance.close(linkUrl);
                        ImportCSVPopup.loading=false;
                    });

                }
                else{
                    $modalInstance.close(linkUrl);
                    ImportCSVPopup.loading=false;
                }
            };
            ImportCSVPopup.cancel = function () {
                $modalInstance.dismiss('Dismiss');
            };
        }])
})(window.angular);