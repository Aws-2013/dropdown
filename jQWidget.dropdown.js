$.widget("custom.dropdown", {
    options: {
        value: 0,
        multiple: false,
        sep: ', ',
        ddContentWidth: '200px',
        ddContentsHeight: '',
        labelDropDown : false
    },
    _create: function() {
        //use _create to build & inject markup 
        var elem = this.element;
        this._bindDropDown(elem);
        this._ddItemHover();
        this._ddHover();
        this._setDropDownWidth(elem);
        this._setDropDownHeight(elem);
        this._buildToolTip(elem);
        this._renderToolTip(elem);
        this._keyDownActions(elem);
        this._calculateOffset(elem);
    },
    _int: function() {
        //use _init for default functionality
    },
    _trigger: function() {
        //Custom events can be fired from within your widget by using the internal _trigger method
    },
    _bindDropDown: function(elem) {
        var self = this;

        //open dropdown contents container
        elem.on('click', '.dd_btn, .inputText', function(e) {
            e.stopPropagation();
            self._openDropDownContent(elem, e);
        });
        //stop propagation on dropdown group
        elem.on('click', function(e){
             e.stopPropagation();
        });
        //clicking a dropdown item
        elem.children('.dd_contents').on('click', 'li', function(e) {            
            e.stopPropagation();
            self._ddItemSelected($(this));
        });
        //when clicking off a dropdown (body) call custom event
        $(document, 'html', 'body').on('click', function(e) {
           self._closeDropDownContent();
        });
        //if label dropdown
        if (this.options.labelDropDown){
            this._bindLabelDropDown(elem);
            this._buildLabelDropDown(elem);
        }
    },
    _bindLabelDropDown: function(elem){
        elem.find('.label_dd').on('mouseenter', function(){
            $(this).addClass('dd_btn');
        });
        elem.find('.label_dd').on('mouseleave', function(){           
            $(this).removeClass('dd_btn'); 
        });
    },
    _buildLabelDropDown: function(elem){        
        var img = '<img class="icon" src="images/black_arrow_no_space.png" />';
        elem.find('.label_dd').append(img);
    },
    _getOffSet: function(elem){
    	
        elem.children('.dd_contents').css({'display': 'block', 'visibility': 'hidden'});
        
        var viewportWidth = $(window).width();
        var viewportHeight = $(window).height();
        var dd_contents = elem.children('.dd_contents');
        var dd_contentsHeight = dd_contents.height();
        var dd_contentsWidth = dd_contents.width();
        var dd_contentsOffset = dd_contents.offset();
        var elemOffset = elem.offset();
        var bottomOffset = (dd_contentsOffset.top + dd_contents.height());
        var rightOffset = (dd_contentsOffset.left + dd_contents.width());
        
       
         elem.children('.dd_contents').css({'display': '', 'visibility': ''});
        
        return{elemOffset: elemOffset, viewportWidth: viewportWidth, viewportHeight: viewportHeight, rightOffset: rightOffset, bottomOffset: bottomOffset}
    },
    _calculateOffset: function(elem){
        var bottom;
        var right;
        var space_bug;
        var offSet = this._getOffSet(elem);  
        
        //console.log(offSet)      
        
    	if (offSet.bottomOffset > offSet.viewportHeight){
            bottom = elem.height();
        }
        if (offSet.rightOffset > offSet.viewportWidth) {
            space_bug = $.support.noCloneChecked  ? 23 : 12;
            right = offSet.viewportWidth - (elem.width() + offSet.elemOffset.left) - space_bug;
        }
		
		elem.children('.dd_contents').css({'bottom': bottom, 'right': right});
        
        //return {bottom: bottom, right: right};
    },
    _openDropDownContent: function(elem, e) {
        // console.log(elem)
        // console.log(elem.children('.dd_contents'))
        // console.log(elem.children('.dd_contents').css('display'))
        // console.log(elem.children('.dd_contents').css('display') == 'block')
        // console.log(elem.children('.dd_contents:visible').size())
        // console.log(elem.children('.dd_contents:visible'))
        // console.log(elem.children('.dd_contents:hidden'))
        // console.log($('.dd_contents:visible'))

        
        //var dd_offset = this._calculateOffset(elem);
       this._calculateOffset(elem);
       	//this._closeDropDownContent();
         $('.dd_contents:visible').toggle();
         elem.children('.dd_contents:hidden').toggle();
         
       //  elem.children('.dd_contents:hidden').toggle();
        // if (e.type === 'click' && elem.children('.dd_contents').css('display') == 'block') {
           // this._closeDropDownContent();
           // console.log('if')
        // }

        // else if (e.which === 40 || e.type === 'click' || e.type === 'keydown' ) {
        	// console.log('else if')
           // //this._closeDropDownContent();
           // elem.children('.dd_contents').show();
           // //var dd_offset = this._calculateOffset(elem);
           // //elem.children('.dd_contents').addClass('visible').removeClass('hidden');
           // //elem.children('.dd_contents').css({'bottom': dd_offset.bottom, 'right': dd_offset.right});
        // }

    },
    _closeDropDownContent: function() {
        var elem = this.element;
        $('.dd_contents:visible').hide();
        elem.children('.dd_contents').css({'bottom': '', 'right': ''});
    },
    _stripTrim: function(listItem) {
        var txt = '';
        var sep = this.options.sep;
        var checked = listItem.parents('.dd_contents').find(':checked');
        var sizechecked = listItem.parents('.dd_contents').find(':checked').size();
       
        checked.each(function(i) {
            sep = i < sizechecked - 1 ? sep : "";
            txt += $.trim($(this).parent().text()) + sep;
        });
        return txt;
    },
    _setDropDownHeight: function(elem) {            
        if (this.options.ddContentsHeight == '' && elem.find('.dd_contents').hasClass('dd_contents_menu')){
            var dd_contents_children = elem.find('ul');
            elem.find('.dd_contents').height(elem.find('.dd_contents_menu ul').outerHeight());
        }
        else {
            elem.find('.dd_contents').height(this.options.ddContentsHeight);
        }
    },
    _setDropDownWidth: function(elem) {
        var imgWidth = '';
        elem.find('.dd_contents').width(this.options.ddContentsWidth);
        //elem.width(elem.find('.input').outerWidth());
        imgWidth = elem.find('.input img').length > 0 ? 16 : 0;
        elem.width(elem.find('.input').outerWidth() + elem.find('.label_dd img').outerWidth() + imgWidth);
    },
    _ddHover: function() {
        var dd_group = $('.dd_ctrl_group');
        dd_group.on('mouseenter', '.inputText', function() {
            $(this).addClass('inputText_hover');
        });
        dd_group.on('mouseleave', '.inputText', function() {
            $(this).removeClass('inputText_hover');
        });
    },
    _ddItemHover: function() {
        var dd_group = $('.dd_ctrl_group');
        dd_group.on('mouseenter', 'li', function() {
            $(this).addClass('li_hover');
        });
        dd_group.on('mouseleave', 'li', function() {
            $(this).removeClass('li_hover');
        });
    },
    _ddItemSelected: function(listItem) {
        var dd_val = '';
        
        //single mode selection
        if (!this.options.multiple) {
            this._closeDropDownContent();
            dd_val = listItem.text();
        }
        //multiple mode selection
        else {
            var txt = this._stripTrim(listItem);
            dd_val = txt;
        }
        
        this._setDropDownValToTextBox(listItem, dd_val);
    },
    _setDropDownValToTextBox: function(listItem, dd_val) {
        listItem.parents('.dd_contents').siblings('.inputText').val(dd_val);
    },
    _buildToolTip: function(elem) {
        var tooltipContainer = '<div class="ddTooltip">&nbsp;</div>';
        $(tooltipContainer).appendTo(elem);
    },
    _renderToolTip: function(elem) {
        var input = elem.find('.inputText');
        var tooltip = elem.find('.ddTooltip');
        var x = 0;
        var y = 0;
        var viewportWidth = 0;
        var viewportHeight = 0;

        input.on('mouseover', function(evt) {
            if (input.val() !== '--Please Select--' && input.val() !== '') {
                x = evt.pageX + 10;
                y = evt.pageY + 10;
                viewportWidth = $(window).width();
                viewportHeight = $(window).height();
                if (elem.find('.dd_contents').is(':hidden')) {
                    tooltip.show();
                    tooltip.html(input.val());
                    tooltip.css({
                        "left": x,
                        "top": 5
                    });
                }
            }
        })

        input.bind('mouseout', function() {
            tooltip.hide();
        });
    },
    _scrollToActive: function(elem, count) {
        elem.find('.dd_contents ul li').removeClass('li_hover');
        elem.find('.dd_contents').stop().scrollTo(elem.find('.dd_contents ul li:nth-child(' + count + ')').addClass('li_hover').focus(), 10);
    },
    _keyDownActions: function(elem) {
        var self = this;
        var count = 0;
        var listItemSize = elem.find('li').size();
        elem.on('keydown', function(e) {
            var key = e.which;
            switch (key) {
                case 40:
                    if (count < listItemSize) {
                        count++;
                        self._openDropDownContent(elem, e);
                        self._scrollToActive(elem, count);
                    }
                    break;
                case 38:
                    //self._closeDropDownContent();

                    if (count > 1) {
                        count--
                        self._scrollToActive(elem, count);
                    }
                    break;
                case 27:
                    self._closeDropDownContent();
                    break;
            }
        });
    },
    _destroy: function() {
        this.element = null;
        alert(this.element);
    }
});