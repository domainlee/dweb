/**
 * Created by mienle on 10/8/18.
 */

$(function(){
    var drapElement = $('#drapElement');
    var button = $('.dropdown-element li');
    var btnDeleteModule = $('.btn__delete--module');

    /****** Banner ********/
    var selectBanner1 = $(".select-ajax-banner");
    // var countBanner = selectBanner1.length;
    // var countGlobalBanner = countBanner;

    var countGlobalBanner = 0;
    var countBanner = 0;

    /****** drapElement ********/
    var drag = {
        drapElement : $('#drapElement'),
        button : $('.dropdown-element li a'),
        btnDeleteModule : $('.btn__delete--module'),
        init: function () {
            $(window).on( 'load', this.loadDrag );
            this.button.click(function () {
                drag.addSection($(this).attr('data-key'));
            });

        },
        addSection: function (section) {
            console.log(section);
            var form_data = new FormData();
            form_data.append("section", section);
            $.ajax({
                data: form_data,
                type: "POST",
                url: "/admin/setup/updated",
                cache: false,
                contentType: false,
                processData: false,
                success: function(data) {
                    drag.drapElement.append(data);
                    drag.uploadImage();
                    drag.addRow();
                }
            });

        },
        addRow: function () {
            var button_add_row = drag.drapElement.find('.add-row');
            button_add_row.on('click', function () {
                var inner = $(this).closest('.portlet-body');
                var section_row = inner.find('.repeater_id').val();
                var section = inner.find('.repeater_layout').val();
                var repeater_list = inner.find('.repeater__list');
                var form_data = new FormData();
                form_data.append("section_row", section_row);
                form_data.append("section", section);
                $.ajax({
                    data: form_data,
                    type: "POST",
                    url: "/admin/setup/updated",
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function(data) {
                        repeater_list.append(data);
                    }
                });
            });
        },
        loadDrag: function () {
            drag.drapElement.sortable({
                handle: ".portlet-heading",
                axis: 'y'
            });
        },
        uploadImage: function () {
            $(":file").filestyle();
            $('.filestyleMulti').each(function () {
                var id = $(this).attr('id');
                var t = $(this);
                var fileInput = document.getElementById(id);
                var fileInputSubmit = document.getElementsByClassName(id);
                var itemImageLoad = $(this).prev();
                var itemImageLoadHidden = $(this).prev().prev();
                var btnImageLoad = itemImageLoad.find('.image-upload__remove');

                fileInput.addEventListener('change', function() {
                    var _this = $(this);
                    var md_10 = _this.closest('.col-md-10');

                    var ins = fileInput.files.length;
                    var form_data = new FormData();
                    for(x = 0; x < ins; x++){
                        var file_data = _this.prop("files")[x];
                        form_data.append("imagemulti[]", file_data);
                    }
                    var inputSubmit = _this.prev().prev();
                    // var valDefault = inputSubmit.val().split(',')[0];
                    var btnRemoveImage = _this.prev().find('.image-upload__remove');
                    _this.parent().find('.wrap-image').remove();

                    $.ajax({
                        data: form_data,
                        type: "POST",
                        url: "/admin/media/upload",
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function(url) {
                            if(url.code) {
                                _this.prev().val(url.url);
                                _this.after('<div class="wrap-image"><a class="btn btn-white image-upload__remove"><i class="ion-trash-a"></i></a><img class="img-responsive img-thumbnail" src="'+url.url+'" /></div>');
                                var btnRemoveImage = _this.parent().find('.image-upload__remove');
                                btnRemoveImage.click(function (e) {
                                    _this.parent().find('.wrap-image').remove();
                                    _this.prev().val('');
                                });
                            }
                        }
                    });
                });

                btnImageLoad.click(function (e) {
                    var valDefault = itemImageLoadHidden.val().split(',')[0];
                    itemImageLoadHidden.val(valDefault);
                    itemImageLoad.html('');
                });
            });

        }
    }
    drag.init();


    var aL = [];
    var bL = [];
    button.each(function () {
        var t = $(this);
        var element = ChangeToSlug(t.find('a').attr('data-label'));
        var count = document.getElementsByClassName(element).length;
        aL[element] = count;
        bL[element] = 0;
    });

    button.each(function(){
        $(this).find('a').click(function (e) {
            e.preventDefault();
            var t = $(this);

        });
    });

    deleteModule();

    function deleteModule() {
        var btnDeleteModule = $('.btn__delete--module');
        btnDeleteModule.unbind().click(function (e) {
            e.preventDefault();
            var t = $(this);
            $(this).closest( ".portlet" ).remove();
            aL[t.attr('data-module')] = aL[t.attr('data-module')] - 1;
            console.log('Delete Count Global '+aL[t.attr('data-module')]);

        });
    }

    function elementAdd (label, type, keyData, limit, count) {
        var banner = '<div class="portlet '+ChangeToSlug(label)+'">'+
            '<div class="portlet-heading portlet-default collapsed" data-toggle="collapse" data-parent="#accordion1" href="#'+ChangeToSlug(label + '_' + count)+'" aria-expanded="false">'+
            '<h3 class="portlet-title">  '+label+' </h3>'+
            '<div class="portlet-widgets">'+
            '<a class="btn__delete--module" data-module="'+ChangeToSlug(label)+'"><i class="ion-trash-a"></i></a>'+
            '<span class="divider"></span>'+
            '<a class=""><i class="ion-minus-round"></i></a>'+
            '</div>'+
            '<div class="clearfix"></div>'+
            '</div>'+
            '<div id="'+ChangeToSlug(label + '_' + count)+'" class="panel-collapse collapse" aria-expanded="false">'+
            '<div class="portlet-body">'+
            '<div class="form-group">'+
            '<label class="col-md-2 control-label">'+label+'</label>'+
            '<div class="col-md-10">'+
            '<input type="hidden" name="banner '+(keyData + '--' + count)+'[]" value="'+[label,limit]+'" />'+
            '<select name="banner '+(keyData + '--' + count)+'[]" class="form-control select-ajax-banner select2-hidden-accessible" data-placeholder="'+label+' '+count+'" data-length="'+limit+'" multiple="multiple"></select>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>';

        return banner;
    }

    function elementMulAdd (label, field, keyData, count, type) {
        var item = '';

        $.each(field, function (k, v) {
            var input = '';
            var name  = '';
            if(v.type == 'checkbox') {
                input = '<input type="hidden" name="'+type+' '+v.keyData+' '+v.type+' field '+keyData + '--'+count+'[]" class="form-control" value="'+[k]+'"  />';
                input += '<div class="checkbox"><input name="'+type+' '+v.keyData+' '+v.type+' field '+keyData + '--'+count+'[]" type="checkbox" class="form-control" /><label>'+k+'</label></div>';
            } else if(v.type == 'text') {
                input = '<input type="hidden" name="'+type+' '+v.keyData+' '+v.type+' field '+keyData + '--'+count+'[]" class="form-control" value="'+[k]+'"  />';
                input += '<input name="'+type+' '+v.keyData+' '+v.type+' field '+keyData + '--'+count+'[]" class="form-control" type="text" />';
            } else if(v.type == 'textarea') {
                input = '<input type="hidden" name="'+type+' '+v.keyData+' '+v.type+' field '+keyData + '--'+count+'[]" class="form-control" value="'+[k]+'"  />';
                input += '<textarea name="'+type+' '+v.keyData+' '+v.type+' field '+keyData + '--'+count+'[]" class="form-control"></textarea>';
            }else if(v.type == 'texteditor') {
                input = '<input type="hidden" name="'+type+' '+v.keyData+' '+v.type+' field '+keyData + '--'+count+'[]" class=" form-control" value="'+[k]+'"  />';
                input += '<textarea name="'+type+' '+v.keyData+' '+v.type+' field '+keyData + '--'+count+'[]" class="textEditor form-control"></textarea>';
            }else if(v.type == 'editorhtml') {
                input = '<div class="panel panel-default">'+
                '<div class="panel-body p-0">';
                input += '<input type="hidden" name="'+type+' '+v.keyData+' '+v.type+' field '+keyData + '--'+count+'[]" class=" form-control" value="'+[k]+'"  />';
                input += '<textarea name="'+type+' '+v.keyData+' '+v.type+' field '+keyData + '--'+count+'[]" id="codeHtml'+count+'" class="editorHtml"></textarea>';
                input += '</div>'+
                    '</div>';
            }else if(v.type == 'file') {
                input = '<input type="hidden" name="'+type+' '+v.keyData+' '+v.type+' field '+keyData + '--'+count+'[]" class="'+v.keyData+' form-control" value="'+[k]+'"  />';
                input += '<div class="image-upload__field"></div>';
                input += '<input type="file" class="filestyle filestyleMulti" id="'+v.keyData+count+'" data-buttontext="'+[k]+'" data-buttonname="btn-white" name="'+type+' '+v.keyData+' '+v.type+' field '+keyData + '--'+count+'[]" />';
            } else if(v.type == 'selectmulti') {
                if(v.name == 'product') {
                    input = '<input type="hidden" name="'+type+' '+v.keyData+' '+v.type+' product '+(keyData + '--'+count)+'[]" class="form-control" value="'+[k, v.limit]+'"  />';
                    input += '<select name="'+type+' '+v.keyData+' '+v.type+' product '+(keyData + '--'+count)+'[]" class="form-control select-ajax-product select2-hidden-accessible" data-placeholder="" data-length="'+v.limit+'" multiple="multiple"></select>';
                } else if(v.name == 'news') {
                    input = '<input type="hidden" name="'+type+' '+v.keyData+' '+v.type+' article '+(keyData + '--'+count)+'[]" class="form-control" value="'+[k, v.limit]+'"  />';
                    input += '<select name="'+type+' '+v.keyData+' '+v.type+' article '+(keyData + '--'+count)+'[]" class="form-control select-ajax-article select2-hidden-accessible" data-placeholder="" data-length="'+v.limit+'" multiple="multiple"></select>';
                } else if(v.name == 'productcategory') {
                    input = '<input type="hidden" name="'+type+' '+v.keyData+' '+v.type+' productcategory '+(keyData + '--'+count)+'[]" class="form-control" value="'+[k, v.limit]+'"  />';
                    input += '<select name="'+type+' '+v.keyData+' '+v.type+' productcategory '+(keyData + '--'+count)+'[]" class="form-control select-ajax-productcategory select2-hidden-accessible" data-placeholder="" data-length="'+v.limit+'" multiple="multiple"></select>';
                } else if(v.name == 'newscategory') {
                    input = '<input type="hidden" name="'+type+' '+v.keyData+' '+v.type+' articlecategory '+(keyData + '--'+count)+'[]" class="form-control" value="'+[k, v.limit]+'"  />';
                    input += '<select name="'+type+' '+v.keyData+' '+v.type+' articlecategory '+(keyData + '--'+count)+'[]" class="form-control select-ajax-articlecategory select2-hidden-accessible" data-placeholder="" data-length="'+v.limit+'" multiple="multiple"></select>';
                } else if(v.name == 'page') {
                    input = '<input type="hidden" name="'+type+' '+v.keyData+' '+v.type+' page '+(keyData + '--'+count)+'[]" class="form-control" value="'+[k, v.limit]+'"  />';
                    input += '<select name="'+type+' '+v.keyData+' '+v.type+' page '+(keyData + '--'+count)+'[]" class="form-control select-ajax-page select2-hidden-accessible" data-placeholder="" data-length="'+v.limit+'" multiple="multiple"></select>';
                } else if(v.name == 'banner') {
                    input = '<input type="hidden" name="'+type+' '+v.keyData+' '+v.type+' banner '+(keyData + '--'+count)+'[]" class="form-control" value="'+[k, v.limit]+'"  />';
                    input += '<select name="'+type+' '+v.keyData+' '+v.type+' banner '+(keyData + '--'+count)+'[]" class="form-control select-ajax-banner select2-hidden-accessible" data-placeholder="" data-length="'+v.limit+'" multiple="multiple"></select>';
                }
            }
            item += '<div class="form-group">'+
                '<label class="col-md-2 control-label">'+k+'</label>'+
                '<div class="col-md-10">'+
                input +
                '</div>'+
                '</div>';
        });

        var module = '<div class="portlet '+ChangeToSlug(label)+'">'+
            '<div class="portlet-heading portlet-default collapsed" data-toggle="collapse" data-parent="#accordion1" href="#'+ChangeToSlug(label + '_' + count)+'" aria-expanded="false">'+
            '<h3 class="portlet-title">  '+label+' </h3>'+
            '<div class="portlet-widgets">'+
            '<a class="btn__delete--module" data-module="'+ChangeToSlug(label)+'"><i class="ion-trash-a"></i></a>'+
            '<span class="divider"></span>'+
            '<a class=""><i class="ion-minus-round"></i></a>'+
            '</div>'+
            '<div class="clearfix"></div>'+
            '</div>'+
            '<div id="'+ChangeToSlug(label + '_' + count)+'" class="panel-collapse collapse" aria-expanded="false">'+
            '<div class="portlet-body">'+
            '<input type="hidden" name="'+type+' labelModule labela label '+(keyData + '--'+count)+'[]" value="'+label+'" />'+
            item +
            '</div>'+
            '</div>'+
            '</div>';

        return module;
    }

    function ChangeToSlug(a)
    {
        var title, slug;
        title = a;
        slug = (title || '').toLowerCase();
        slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
        slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
        slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
        slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
        slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
        slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
        slug = slug.replace(/đ/gi, 'd');
        slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
        slug = slug.replace(/ /gi, "-");
        slug = slug.replace(/\-\-\-\-\-/gi, '-');
        slug = slug.replace(/\-\-\-\-/gi, '-');
        slug = slug.replace(/\-\-\-/gi, '-');
        slug = slug.replace(/\-\-/gi, '-');
        slug = '@' + slug + '@';
        slug = slug.replace(/\@\-|\-\@|\@/gi, '');
        return slug;
    }

    textEditor();

    function textEditor() {
        $('.textEditor').summernote({
            popover: {
                image: [
                    ['custom', ['imageAttributes']],
                    ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
                    ['float', ['floatLeft', 'floatRight', 'floatNone']],
                    ['remove', ['removeMedia']]
                ],
            },
            height: 200,                 // set editor height
            minHeight: null,             // set minimum height of editor
            maxHeight: null,             // set maximum height of editor
            focus: false,                 // set focus to editable area after initializing summernote
            lang: "vi-VN",
            callbacks: {
                onImageUpload: function (image) {
                    sendFile(image[0]);
                }
            },
            imageAttributes:{
                icon:'<i class="note-icon-pencil"/>',
                removeEmpty:false, // true = remove attributes | false = leave empty if present
                disableUpload: false // true = don't display Upload Options | Display Upload Options
            },
        });

        function sendFile(image) {
            var data = new FormData();
            data.append("imagemulti[]", image);
            $.ajax({
                data: data,
                type: "POST",
                url: "/admin/media/upload",
                cache: false,
                contentType: false,
                processData: false,
                success: function(data) {
                    $('.textEditor').summernote("insertImage", data.url);
                }
            });
        }
    }

    uploadImage();

    function uploadImage() {

        $('.filestyleMulti').each(function () {

            var id = $(this).attr('id');
            var t = $(this);
            var fileInput = document.getElementById(id);
            var fileInputSubmit = document.getElementsByClassName(id);
            var itemImageLoad = $(this).prev();
            var itemImageLoadHidden = $(this).prev().prev();
            var btnImageLoad = itemImageLoad.find('.image-upload__remove');

                fileInput.addEventListener('change', function() {
                    var _this = $(this);
                    var md_10 = _this.closest('.col-md-10');

                    var ins = fileInput.files.length;
                    var form_data = new FormData();
                    for(x = 0; x < ins; x++){
                        var file_data = _this.prop("files")[x];
                        form_data.append("imagemulti[]", file_data);
                    }
                    var inputSubmit = _this.prev().prev();
                    var valDefault = inputSubmit.val().split(',')[0];
                    var btnRemoveImage = _this.prev().find('.image-upload__remove');

                    $.ajax({
                        data: form_data,
                        type: "POST",
                        url: "/admin/media/upload",
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function(url) {
                            if(url.code) {
                                inputSubmit.val(valDefault+','+url.url);
                                _this.prev().html('<a class="btn btn-white image-upload__remove"><i class="ion-trash-a"></i></a><img class="img-responsive img-thumbnail" src="'+url.url+'" />');

                                var btnRemoveImage = _this.prev().find('.image-upload__remove');
                                btnRemoveImage.click(function (e) {
                                    inputSubmit.val(valDefault);
                                    _this.prev().html('');
                                    fileInput.value = "";
                                });
                            }
                        }
                    });
                });

            btnImageLoad.click(function (e) {
                var valDefault = itemImageLoadHidden.val().split(',')[0];
                itemImageLoadHidden.val(valDefault);
                itemImageLoad.html('');
            });
        });

    }

    // codeEditor(c);

    function codeEditor(c) {
        if(c.length) {
            var editor = CodeMirror.fromTextArea(document.getElementById(c), {
                mode: {name: "xml", alignCDATA: true},
                lineNumbers: true,
                theme: 'ambiance'
            });
            var sh = setInterval(function() {
                editor.refresh();
            }, 500);
            setTimeout(function(){
                clearInterval(sh);
            },2000);
        }
    }

    $('.editorHtml').each(function (index, lem) {
        $(this).attr('id', 'code-' + index);
        var editor = CodeMirror.fromTextArea(lem, {
            mode: {name: "xml", alignCDATA: true},
            lineNumbers: true,
            theme: 'ambiance'
        });
        var sh = setInterval(function() {
            editor.refresh();
        }, 500);
        setTimeout(function(){
            clearInterval(sh);
        },2000);
    });


    function scripLoad () {
        uploadImage();

        $(":file").filestyle();
        deleteModule();
        textEditor();
        drapElement.sortable();
        var selectBanner1 = $(".select-ajax-banner");
        selectBanner1.each(function () {
            var selectBanner = $(this);
            var lengthBanner = selectBanner.attr('data-length') ? selectBanner.attr('data-length'):5;
            var placeholderBanner = selectBanner.attr('data-placeholder') ? selectBanner.attr('data-placeholder'):'Banner';
            if(selectBanner.length) {
                selectBanner.select2({
                    placeholder: placeholderBanner,
                    multiple: true,
                    maximumSelectionLength: lengthBanner,
                    ajax: {
                        url: "/admin/product/related",
                        dataType: 'json',
                        delay: 250,
                        data: function (params) {
                            return {
                                keyword: params.term,
                                banner: true
                            };
                        },
                        processResults: function (data, params) {
                            return {
                                results: data,
                            };
                        },
                        cache: true
                    },
                });

                selectBanner.on("select2:select", function (evt) {
                    var element = evt.params.data.element;
                    var $element = $(element);

                    $element.detach();
                    $(this).append($element);
                    $(this).trigger("change");
                });
            }
        });

        var selectProduct1 = $(".select-ajax-product");
        selectProduct1.each(function () {
            var selectProduct = $(this);
            var length = selectProduct.attr('data-length') ? selectProduct.attr('data-length'):5;
            var placeholderProduct = selectProduct.attr('data-placeholder') ? selectProduct.attr('data-placeholder'):'Sản phẩm liên quan';
            if(selectProduct.length) {
                selectProduct.select2({
                    placeholder: placeholderProduct,
                    multiple: true,
                    maximumSelectionLength: length,
                    ajax: {
                        url: "/admin/product/related",
                        dataType: 'json',
                        delay: 250,
                        data: function (params) {
                            return {
                                keyword: params.term, // search term
                            };
                        },
                        processResults: function (data, params) {
                            return {
                                results: data,
                            };
                        },
                        cache: true
                    },
                });
                selectProduct.on("select2:select", function (evt) {
                    var element = evt.params.data.element;
                    var $element = $(element);

                    $element.detach();
                    $(this).append($element);
                    $(this).trigger("change");
                });
            }
        });

        var selectArticle1 = $(".select-ajax-article");
        selectArticle1.each(function () {
            var selectArticle = $(this);
            var lengthArticle = selectArticle.attr('data-length') ? selectArticle.attr('data-length'):5;
            var placeholderArticle = selectArticle.attr('data-placeholder') ? selectArticle.attr('data-placeholder'):'Bài viết liên quan';
            if(selectArticle.length) {
                selectArticle.select2({
                    placeholder: placeholderArticle,
                    multiple: true,
                    maximumSelectionLength: lengthArticle,
                    ajax: {
                        url: "/admin/product/related",
                        dataType: 'json',
                        delay: 250,
                        data: function (params) {
                            return {
                                keyword: params.term,
                                article: true
                            };
                        },
                        processResults: function (data, params) {
                            return {
                                results: data,
                            };
                        },
                        cache: true
                    },
                });
                selectArticle.on("select2:select", function (evt) {
                    var element = evt.params.data.element;
                    var $element = $(element);

                    $element.detach();
                    $(this).append($element);
                    $(this).trigger("change");
                });
            }
        });


        var selectPage1 = $(".select-ajax-page");
        selectPage1.each(function () {
            var selectPage = $(this);
            var lengthPage = selectPage.attr('data-length') ? selectPage.attr('data-length'):5;
            var placeholderPage = selectPage.attr('data-placeholder') ? selectPage.attr('data-placeholder'):'Trang';
            if(selectPage.length) {
                selectPage.select2({
                    placeholder: placeholderPage,
                    multiple: true,
                    maximumSelectionLength: lengthPage,
                    ajax: {
                        url: "/admin/product/related",
                        dataType: 'json',
                        delay: 250,
                        data: function (params) {
                            return {
                                keyword: params.term,
                                page: true
                            };
                        },
                        processResults: function (data, params) {
                            return {
                                results: data,
                            };
                        },
                        cache: true
                    },
                });
                selectPage.on("select2:select", function (evt) {
                    var element = evt.params.data.element;
                    var $element = $(element);

                    $element.detach();
                    $(this).append($element);
                    $(this).trigger("change");
                });
            }
        });

        var selectProductCategory1 = $(".select-ajax-productcategory");
        selectProductCategory1.each(function () {
            var selectProductCategory = $(this);
            var lengthProductCategory = selectProductCategory.attr('data-length') ? selectProductCategory.attr('data-length'):5;
            var placeholderProductCategory = selectProductCategory.attr('data-placeholder') ? selectProductCategory.attr('data-placeholder'):'Danh mục sản phẩm';
            if(selectProductCategory.length) {
                selectProductCategory.select2({
                    placeholder: placeholderProductCategory,
                    multiple: true,
                    maximumSelectionLength: lengthProductCategory,
                    ajax: {
                        url: "/admin/product/related",
                        dataType: 'json',
                        delay: 250,
                        data: function (params) {
                            return {
                                keyword: params.term,
                                categoryproduct: true
                            };
                        },
                        processResults: function (data, params) {
                            return {
                                results: data,
                            };
                        },
                        cache: true
                    },
                });
                selectProductCategory.on("select2:select", function (evt) {
                    var element = evt.params.data.element;
                    var $element = $(element);

                    $element.detach();
                    $(this).append($element);
                    $(this).trigger("change");
                });
            }
        });

        var selectArticleCategory1 = $(".select-ajax-articlecategory");
        selectArticleCategory1.each(function () {
            var selectArticleCategory = $(this);
            var lengthArticleCategory = selectArticleCategory.attr('data-length') ? selectArticleCategory.attr('data-length'):5;
            var placeholderArticleCategory = selectArticleCategory.attr('data-placeholder') ? selectArticleCategory.attr('data-placeholder'):'Danh mục bài viết';
            if(selectArticleCategory.length) {
                selectArticleCategory.select2({
                    placeholder: placeholderArticleCategory,
                    multiple: true,
                    maximumSelectionLength: lengthArticleCategory,
                    ajax: {
                        url: "/admin/product/related",
                        dataType: 'json',
                        delay: 250,
                        data: function (params) {
                            return {
                                keyword: params.term,
                                categoryarticle: true
                            };
                        },
                        processResults: function (data, params) {
                            return {
                                results: data,
                            };
                        },
                        cache: true
                    },
                });
                selectArticleCategory.on("select2:select", function (evt) {
                    var element = evt.params.data.element;
                    var $element = $(element);

                    $element.detach();
                    $(this).append($element);
                    $(this).trigger("change");
                });
            }
        });

        var selectPage1 = $(".select-ajax-page");
        selectPage1.each(function () {
            var selectPage = $(this);
            var lengthPage = selectPage.attr('data-length') ? selectPage.attr('data-length'):5;
            var placeholderPage = selectPage.attr('data-placeholder') ? selectPage.attr('data-placeholder'):'Trang';
            if(selectPage.length) {
                selectPage.select2({
                    placeholder: placeholderPage,
                    multiple: true,
                    maximumSelectionLength: lengthPage,
                    ajax: {
                        url: "/admin/product/related",
                        dataType: 'json',
                        delay: 250,
                        data: function (params) {
                            return {
                                keyword: params.term,
                                page: true
                            };
                        },
                        processResults: function (data, params) {
                            return {
                                results: data,
                            };
                        },
                        cache: true
                    },
                });
                selectPage.on("select2:select", function (evt) {
                    var element = evt.params.data.element;
                    var $element = $(element);

                    $element.detach();
                    $(this).append($element);
                    $(this).trigger("change");
                });
            }
        });



    }

});

