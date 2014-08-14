var controllers = angular.module('SB.controllers', ['SB.services', 'angularFileUpload', 'ngGrid', 'SB.directives'])

controllers.controller('homeCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $scope.reg = function (user) {

        }
        $scope.login = function (user) {
            $scope.alert = true;
            // $http.post('/web/sign/signup',user).success(function (data){

            // });
        }
    }
]);

controllers.controller('addCtrl', ['$scope', '$http', '$location', 'sbInfo','$q',
    function ($scope, $http, $location, sbInfo,$q) {
        if ($.nicescroll.length && $.nicescroll[0]) {
            $.nicescroll.remove();
        }
        if (sbInfo.info) {
            $scope.user = {
                groups: sbInfo.info.contactGroups
            };
        } else {
            sbInfo.get().success(function (res) {
                sbInfo.info = res.info;
                $scope.user = {
                    groups: sbInfo.info.contactGroups
                };
            });
        }
        var div = $('.advanced-info');
        $scope.newContact = {};
        $scope.newNote = {};
        $scope.advance = {
            plus: function (key) {
                $scope.newContact[key].push('');
                div.getNiceScroll().resize();
            },
            minus: function (key, index) {
                if ($scope.newContact[key].length > 1) {
                    $scope.newContact[key].splice(index, 1);
                    div.getNiceScroll().resize();
                } else {
                    $scope.newContact[key][0] = '';
                }
            }
        };
        $scope.advancedInfoInput = [{
            display: '行业',
            value: 'field'
        }, {
            display: '手机',
            value: 'mobile'
        }, {
            display: '电话',
            value: 'number'
        }];
        $scope.basicInfoInput = [{
            display: '地区',
            value: 'area'
        }, {
            display: '部门',
            value: 'department'
        }, {
            display: '职位',
            value: 'position'
        }, {
            display: '公司',
            value: 'company'
        }, {
            display: '网站',
            value: 'website'
        }, {
            display: '地址',
            value: 'address'
        }];
        $scope.addNewContact = function () {
            var postGroup = null;
            if ($scope.group) {
                postGroup={
                    display:$scope.group.display,
                    groupId:$scope.group.groupId
                }
            }
            var post = {
                user: sbInfo.info,
                newContact: $scope.newContact,
                newNote: $scope.newNote,
                group: postGroup
            };
            $http.post('/app/contacts/add', post).success(function (res) {
                sbInfo.info = res.info;
                $location.search('id', res.contactId).path('/contacts/detail');
            }).error(function () {

            });
        }
    }
]);

controllers.controller('uploadCtrl', ['$scope', '$http', '$fileUploader', '$timeout', 'sbInfo',
    function ($scope, $http, $fileUploader, $timeout, sbInfo) {
        if ($.nicescroll.length && $.nicescroll[0]) {
            $.nicescroll.remove();
        }
        if (sbInfo.info) {
            $scope.user = {
                groups: sbInfo.info.contactGroups
            };
        } else {
            sbInfo.get().success(function (res) {
                sbInfo.info = res.info;
                $scope.user = {
                    groups: sbInfo.info.contactGroups
                };
            });
        }
        var uploader = $scope.uploader = $fileUploader.create({
            scope: $scope,
            url: '/app/contacts/upload/start',
            formData: [{}],
            queueLimit: 1,
            filters: [
                function (item) {
                    return item.size <= 5242880;
                }
            ]
        });
        var options = [{
            label: '姓名',
            key: 'name',
            multiple: false,
            disabled: false
        }, {
            label: '性别',
            key: 'gender',
            multiple: false,
            disabled: false
        }, {
            label: '行业',
            key: 'field',
            multiple: true,
            disabled: false
        }, {
            label: '职位',
            key: 'position',
            multiple: false,
            disabled: false
        }, {
            label: '公司',
            key: 'company',
            multiple: false,
            disabled: false
        }, {
            label: '部门',
            key: 'department',
            multiple: false,
            disabled: false
        }, {
            label: '地区',
            key: 'area',
            multiple: false,
            disabled: false
        }, {
            label: '手机',
            key: 'mobile',
            multiple: true,
            disabled: false
        }, {
            label: '邮箱',
            key: 'email',
            multiple: false,
            disabled: false
        }, {
            label: '电话',
            key: 'number',
            multiple: true,
            disabled: false
        }, {
            label: '网站',
            key: 'website',
            multiple: false,
            disabled: false
        }, {
            label: 'QQ',
            key: 'qq',
            multiple: false,
            disabled: false
        }, {
            label: '地址',
            key: 'address',
            multiple: false,
            disabled: false
        }, {
            label: '自定义',
            key: 'extra',
            multiple: true,
            disabled: false
        }, ];
        $scope.sys = {
            options: options,
            mappingConfirm: function () {
                var postGroup = null;
                if ($scope.group) {
                    postGroup={
                        display:$scope.group.display,
                        groupId:$scope.group.groupId
                    }
                }
                var post = {
                    user: sbInfo.info,
                    group: postGroup,
                    format: [],
                    path: $scope.mapping.path
                };
                if($scope.mapping.cardid){
                    $scope.mapping.header.splice({key:'cardid'},1);
                }
                for (var i = 0, len = $scope.mapping.header.length; i < len; i++) {
                    var item = $scope.mapping.header[i];
                    if (item.key != '') {
                        post.format.push(item.key);
                    } else {
                        post.format.push(null);
                    }
                }
                $http.post('/app/contacts/upload/end', post).success(function (res) {
                    sbInfo.info = res.info;
                    $scope.step = 3;
                }).error(function () {

                });
            },
            mappingCheck: function () {
                return !(angular.element('.dbody .active').length > 0);
            }
        };
        uploader.filters.push(function (item) {
            return !uploader.isHTML5 ? true : /(xlsb|xlsm|xlsx|xls|csv)$/.test(item.name);
        });
        uploader.bind('complete', function (e, xhr, item, res) {
            var time = $timeout(function () {
                $scope.step = 2;
                angular.element('#sb-contacts-upload .main .step2 .dbody').css('height', angular.element(window).height() - 380).getNiceScroll().resize();
            }, 1000);
            $scope.mapping = res.mapping;
        });
        $scope.prevStep = function () {
            $scope.step = 1;
        }
        $scope.step = 1;
    }
]).directive('ngMappingWatcher', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr) {
            scope.$watch(attr.ngModel, function (newValue, oldValue) {
                var len = scope.$parent.sys.options.length;
                if (oldValue !== '') {
                    for (var i = 0; i < len; i++) {
                        var now = scope.$parent.sys.options[i];
                        if (!now.multiple && now.key == oldValue) {
                            now.disabled = !now.disabled;
                        }
                        if (!now.multiple && now.key == newValue) {
                            now.disabled = !now.disabled;
                        }
                    }
                } else {
                    for (var i = 0; i < len; i++) {
                        var now = scope.$parent.sys.options[i];
                        if (!now.multiple && now.key == newValue) {
                            now.disabled = !now.disabled;
                            return false;
                        }
                    }
                }
            });
        }
    };
});

controllers.controller('contactsListCtrl', ['$scope', '$http', '$modal', '$window','sbInfo',
    function ($scope, $http, $modal, $window, sbInfo) {
        if ($.nicescroll.length && $.nicescroll[0]) {
            $.nicescroll.remove();
        }
        if (sbInfo.info) {
            $scope.groups = {
                total: sbInfo.info.groupStatus.contact.total,
                ungrouped: sbInfo.info.groupStatus.contact.ungrouped,
                default:sbInfo.info.tags,
                custom: sbInfo.info.contactGroups,
            };
            $scope.myColumnDefs = sbInfo.info.settings.columnDefs;
            $scope.myExtraColumns = sbInfo.info.settings.extraColumns;
        } else {
            sbInfo.get().success(function (res) {
                sbInfo.info = res.info;
                $scope.groups = {
                    total: sbInfo.info.groupStatus.contact.total,
                    ungrouped: sbInfo.info.groupStatus.contact.ungrouped,
                    default:sbInfo.info.tags,
                    custom: sbInfo.info.contactGroups,
                };
                $scope.myColumnDefs = sbInfo.info.settings.columnDefs;
                $scope.myExtraColumns = sbInfo.info.settings.extraColumns;
            });
        }
        $http.get('/data/contacts/group/total').success(function (res) {
            $scope.myData = res.data;
        }).error(function () {

        });
        $scope.changeGroup = function (id, name) {
            if(id){
                $scope.activeGroup = {
                    display: name,
                    groupId: id
                };
                $http.get('/data/contacts/group/' + id).success(function (res) {
                    $scope.myData = res.data;
                    $scope.gridOptions.selectAll(false);
                }).error(function () {

                });
            }else{
                $scope.activeGroup = {
                    display: name,
                    groupId: null
                };
                $http.get('/data/contacts/tag/' + name).success(function (res) {
                    $scope.myData = res.data;
                    $scope.gridOptions.selectAll(false);
                }).error(function () {

                });
            }
        };
        $scope.downloadList=function(){
            var post = {
                    user: sbInfo.info,
                    update: {
                        group: group
                    }
                },
                contactIds = [];
            for (var i = 0, len = $scope.mySelections.length; i < len; i++) {
                var item = $scope.mySelections[i];
                contactIds.push(item._id);
            }
        };
        $scope.deleteGroup=function(){
            var post = {
                    user: sbInfo.info,
                };
            $http.delete('/data/contacts/group/'+$scope.activeGroup.groupId, post).success(function (res) {
                $window.location.reload();
            }).error(function () {

            });
        };
        $scope.clearGroup=function(){
            var post = {
                    user: sbInfo.info,
                    update: {
                        group: {}
                    }
                },
                contactIds = [];
            for (var i = 0, len = $scope.myData.length; i < len; i++) {
                var item = $scope.myData[i];
                contactIds.push(item._id);
            }
            $http.put('/data/contacts/multiedit/' + contactIds.join(','), post).success(function (res) {
                $scope.myData=[];
                sbInfo.info = res.info;
                $scope.groups = {
                    total: sbInfo.info.groupStatus.contact.total,
                    ungrouped: sbInfo.info.groupStatus.contact.ungrouped,
                    default:sbInfo.info.tags,
                    custom: sbInfo.info.contactGroups,
                };
            }).error(function () {

            });
        };
        $scope.targetGroup = function (group) {
            var postGroup={
                display:group.display,
                groupId:group.groupId
            },post = {
                    user: sbInfo.info,
                    update: {
                        group: postGroup
                    }
                },
                contactIds = [];
            for (var i = 0, len = $scope.mySelections.length; i < len; i++) {
                var item = $scope.mySelections[i];
                contactIds.push(item._id);
            }
            if(postGroup.groupId!=$scope.activeGroup.groupId){
                $http.put('/data/contacts/multiedit/' + contactIds.join(','), post).success(function (res) {
                    if ($scope.activeGroup.groupId&&$scope.activeGroup.groupId != 'total') {
                        for (var i = 0, len = $scope.mySelections.length; i < len; i++) {
                            var index = $scope.myData.indexOf($scope.mySelections[i]);
                            $scope.myData.splice(index, 1);
                        }
                    }
                    sbInfo.info = res.info;
                    $scope.groups = {
                        total: sbInfo.info.groupStatus.contact.total,
                        ungrouped: sbInfo.info.groupStatus.contact.ungrouped,
                        default:sbInfo.info.tags,
                        custom: sbInfo.info.contactGroups,
                    };
                }).error(function () {

                });
            }
        }
        $scope.openCustomModal = function (size) {
            var modalInstance = $modal.open({
                templateUrl: '/jade/customModal',
                controller: ModalInstanceCtrl,
                size: size,
                resolve: {
                    transfer: function () {
                        return {
                            myColumnDefs: $scope.myColumnDefs,
                            myExtraColumns: $scope.myExtraColumns
                        };
                    }
                }
            });
            modalInstance.result.then(function (columns) {
                $scope.myColumnDefs = columns;
            }, function () {

            });
        };
        var Delay;
        $scope.$on('ngGridEventEndCellEdit', function (evt) {
            var row = evt.targetScope.row.entity,
                post = {
                    extra: row.extra
                };
            clearTimeout(Delay);
            if (row.extra.length) {
                Delay = setTimeout(function () {
                    $http.put('/data/contacts/edit/' + row._id, post).success(function () {

                    }).error(function () {

                    });
                }, 500);
            }
        });
        var ModalInstanceCtrl = function ($scope, $modalInstance, transfer) {
            $scope.myColumnDefs = angular.copy(transfer.myColumnDefs);
            $scope.myExtraColumns = angular.copy(transfer.myExtraColumns);
            $scope.ok = function () {
                var post = {
                    update: {
                        settings: {
                            columnDefs: $scope.myColumnDefs,
                            extraColumns: $scope.myExtraColumns
                        }
                    }
                }
                $http.put('/data/users/edit/self', post).success(function () {
                    $modalInstance.close($scope.myColumnDefs);
                });
            }
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            }
            $scope.add = function () {
                var extra = {
                    field: 'extra[' + $scope.myExtraColumns + ']',
                    displayName: '自定义',
                    visible: false,
                    enableCellEdit: true
                }
                $scope.myColumnDefs.push(extra);
                $scope.myExtraColumns++;
            }
        };
        $scope.confirmFilter = function () {
            var url;
            if($scope.activeGroup.groupId){
                url = '/data/contacts/group/';
                url += $scope.activeGroup.groupId;
            }else{
                url='/data/contacts/tag/';
                url+=$scope.activeGroup.display;
            }
            url += '?filter[' + $scope.filter.factor.key + ']=' + $scope.filter.factor.value;
            $http.get(url).success(function (res) {
                $scope.myData = res.data;
            }).error(function () {

            });
        };
        $scope.filter = {
            factor: {
                display: '公司',
                key: 'company',
                value: ''
            },
            range: [{
                display: '公司',
                key: 'company'
            }, {
                display: '职位',
                key: 'position'
            }, {
                display: '部门',
                key: 'department'
            }, {
                display: '地区',
                key: 'area'
            }],
            isOpen: false
        };
        $scope.activeGroup = {
            display: '全部联系人',
            groupId: 'total'
        };
        $scope.mySelections = [];
        $scope.gridOptions = {
            data: 'myData',
            selectedItems: $scope.mySelections,
            enableColumnResize: true,
            enableHighlighting: true,
            selectWithCheckboxOnly: true,
            showSelectionCheckbox: true,
            enableCellEditOnFocus: true,
            i18n: 'zh-cn',
            columnDefs: 'myColumnDefs'
        };
    }
]);

controllers.controller('detailCtrl', ['$scope', '$http', '$location', 'sbInfo',
    function ($scope, $http, $location, sbInfo) {
        if (sbInfo.info) {
            $scope.user = {
                groups: sbInfo.info.contactGroups
            };
        } else {
            sbInfo.get().success(function (res) {
                sbInfo.info = res.info;
                $scope.user = {
                    groups: sbInfo.info.contactGroups
                };
            });
        }
        var oldContact, post = {};
        $scope.contactInit = [{
            display: '地区',
            value: 'area',
            multiple: false
        }, {
            display: '部门',
            value: 'department',
            multiple: false
        }, {
            display: '职位',
            value: 'position',
            multiple: false
        }, {
            display: '公司',
            value: 'company',
            multiple: false
        }, {
            display: '网站',
            value: 'website',
            multiple: false
        }, {
            display: '地址',
            value: 'address',
            multiple: false
        }, {
            display: '行业',
            value: 'field',
            multiple: true
        }, {
            display: '手机',
            value: 'mobile',
            multiple: true
        }, {
            display: '电话',
            value: 'number',
            multiple: true
        }, {
            display: '邮箱',
            value: 'email',
            multiple: false
        }, {
            display: 'QQ',
            value: 'qq',
            multiple: false
        }];
        $scope.addNewNote = function () {
            var post = {
                newNoteContent: $scope.newNoteContent,
                belongTo: $location.$$search.id
            }
            $http.post('/data/notes/insert', post).success(function (res) {
                $scope.contact.notes.unshift(res.note);
                $scope.newNoteContent = '';
            }).error(function () {

            });
        }
        var div = $('.left');
        $scope.advance = {
            plus: function (key, s) {
                $scope.contact[key].push('');
                div.getNiceScroll().resize();
            },
            minus: function (key, index) {
                if ($scope.contact[key].length > 1) {
                    $scope.contact[key].splice(index, 1);
                    div.getNiceScroll().resize();
                } else {
                    $scope.contact[key][0] = '';
                }
            }
        };
        $scope.watchContact = function () {
            oldContact = angular.copy($scope.contact);
            $scope.edit.tip = '请点击保存，完成修改!';
        }
        $scope.confirmContact = function () {
            for (var key in $scope.contact) {
                if (!angular.equals(oldContact[key], $scope.contact[key])) {
                    post[key] = $scope.contact[key];
                }
            }
            if (!angular.equals(post, {})) {
                $http.put('/data/contacts/edit/' + $location.$$search.id, post).success(function () {
                    $scope.edit.tip = '修改完成!';
                    setTimeout(function () {
                        $scope.$apply(function () {
                            $scope.edit.tip = '';
                        })
                    }, 1500);
                }).error(function () {

                });
            } else {
                $scope.edit.tip = '';
            }
        }
        $scope.cancelContact = function () {
            $scope.contact = oldContact;
            $scope.edit.tip = '修改取消!';
            setTimeout(function () {
                $scope.$apply(function () {
                    $scope.edit.tip = '';
                })
            }, 1500);
        }
    }
]);

controllers.controller('settingsCtrl', ['$scope', '$http', 'sbInfo', '$window',
    function ($scope, $http, sbInfo, $window) {
        $scope.changeName = {
            name: sbInfo.info.name,
            display: false,
            status: ''
        };
        $scope.confirmChangeName = function () {
            var post = {
                update: {
                    name: $scope.changeName.name
                }
            };
            $http.put('/data/users/edit/self', post).success(function () {
                $scope.changeName.display = true;
                $scope.changeName.status = '修改完成';
                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.changeName.display = false;
                    });
                }, 1000);
            }).error(function () {
                $scope.changeName.display = true;
                $scope.changeName.status = '修改失败';
            });
        }
        $scope.changePwd = {
            newPwd: '',
            reNewPwd: ''
        };
        $scope.confirmChangePwd = function () {
            if ($scope.changePwd.oldPwd.length) {

            }
            var post = {
                oldPwd: $scope.changePwd.oldPwd,
                newPwd: $scope.changePwd.newPwd
            };
            $http.put('/data/users/changePwd/self', post).success(function () {
                $window.location.href = '/';
            }).error(function () {
                $scope.error = 2;
                $scope.changePwd.status = '修改失败';
            });
        };
        $scope.checkPwd = function () {
            if ($scope.changePwd.reNewPwd == $scope.changePwd.newPwd) {
                $scope.error = 0;
            } else if ($scope.changePwd.reNewPwd == '') {
                $scope.error = null;
            } else {
                $scope.error = 1;
                $scope.changePwd.status = '两次密码不一致'
            }
        };
    }
]);