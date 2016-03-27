// Initialize your app
var myApp = new Framework7({
    swipePanel: 'right'
});

// Export selectors engine
var $$ = Dom7;

var quranXML = '';
var quranXML_urdu = '';
var quranData = '';
var navButtons = '';
var count = 1;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page) {
    // // run createContentPage func after link was clicked
    // $$('.create-page').on('click', function () {
    //     createContentPage();
    // });
});

myApp.onPageInit('index', function (page) {
   
});

 $(document).ready(function(){
        myApp.showIndicator();
            $.ajax({
            type: "GET",
            url: "./quran-simple.xml",
            dataType: "xml",
            success: function(xml) {
                    quranXML = xml;
                    $.ajax({
                        type: "GET",
                        url: "./quran-data.xml",
                        dataType: "xml",
                        success: function(xml) {
                                quranData = xml;
                                $.ajax({
                                    type: "GET",
                                    url: "./ur.jalandhry.xml",
                                    dataType: "xml",
                                    success: function(xmlUr) {
                                            quranXML_urdu = xmlUr;
                                            loadQuranToDOM(1)
                                            myApp.hideIndicator();
                                            },
                                    error: function(er){
                                        
                                    }
                                });
                                },
                        error: function(er){
                            
                        }
                    });
                    },
            error: function(er){
                
            }
        });

    });

function loadQuranToDOM(sIndex)
{
    myApp.showIndicator();
    setTimeout(function() {
        var pageHtml = "";
          
        $(quranXML).find('sura[index="'+sIndex+'"]').each(function () {
            var surahName = $(quranXML).find($(this)).attr('name');
            var nextSurah = "";
            var nextSurahIndex = "";
            if(sIndex != 114)
            {
                nextSurah = $(quranXML).find('sura[index="'+(parseInt(sIndex)+1)+'"]').attr('name');
                nextSurahIndex = 'onClick="loadQuranToDOM('+(parseInt(sIndex)+1)+')"';
            }
            var prevSurah = "";
            var prevSurahIndex = "";
            if(sIndex != 1)
            {
                prevSurah = $(quranXML).find('sura[index="'+(parseInt(sIndex)-1)+'"]').attr('name');
                prevSurahIndex = 'onClick="loadQuranToDOM('+(parseInt(sIndex)-1)+')"';
            }
            var surahNo = $(quranXML).find($(this)).attr('index');
            var bismillah = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
            pageHtml = '<table class="table Qayah">';
            navButtons = '<div class="row" style="padding:10px">'+
                            '<div class="col-33">'+
                                '<a href="#" '+nextSurahIndex+' class="button button-big button-red"><i class="icon icon-back"></i>&nbsp'+nextSurah+'</a>'+
                            '</div>'+
                            '<div class="col-33">'+
                                '<a href="#" class="button button-big button-red">'+surahName+'</a>'+
                            '</div>'+
                            '<div class="col-33">'+
                                '<a href="#" '+prevSurahIndex+' class="button button-big button-green">'+prevSurah+'&nbsp<i class="icon icon-forward"></i></a>'+
                            '</div>'+
                        '</div>';
            pageHtml += '<tr">'+
                            navButtons 
                        '</tr>';
            pageHtml += '<tr class="surahname"><td id="ayah0" style="text-align:center" colspan="2">سورۃ ' + surahName + '&nbsp<span class="badge">'+surahNo+'</span></td></tr>';
            if(surahNo != 9)
                pageHtml += '<tr class="bismillah"><td style="text-align:center" colspan="2">' + bismillah + '</td></tr>';
            
            $(this).find('aya').each(function () {
                var ayaNum = $(this).attr('index');
                var translation = $(quranXML_urdu).find('sura[index="'+(parseInt(sIndex))+'"]').find('aya[index="'+(parseInt(ayaNum))+'"]').attr('text');
                pageHtml += '<tr onClick="open_translation_popover(this,\''+translation+'\')" id="surah'+surahNo+'_ayah'+ayaNum+'"><td class="ayahSymbol">' + ayaNum + '</td><td style="text-align:justify;direction: rtl;">' + $(this).attr('text') + '</td></tr>';    
            });
            pageHtml += '</table>';
            
            
            
        });
        $("#quranContent").html(pageHtml);
        $("#toolbarBottom").html(navButtons); 
        myApp.hideIndicator();
    }, 1);  
    
         
    
}

function open_translation_popover(obj,text)
{
    var clickedLink = obj;
    var popoverHTML = '<div class="popover">'+
                      '<div class="popover-inner">'+
                        '<div class="content-block" style="direction:rtl; font-family:arabicFont; font-size: 20px;">'+
                          '<p>'+text+'</p>'+
                        '</div>'+
                      '</div>'+
                    '</div>'
  myApp.popover(popoverHTML, clickedLink);
}

function gotoSurah(surahN, AyahN)
{
    myApp.closeModal();
    loadQuranToDOM(surahN)
    if(AyahN != 1)
    {
        setTimeout(function() {
            $("#surah"+surahN+"_ayah"+AyahN)[0].scrollIntoView(false);
        }, 10);
        
    }
    $("#surah"+surahN+"_ayah"+AyahN).css('background','yellow');
    setTimeout(function() {
        $("#surah"+surahN+"_ayah"+AyahN).removeAttr('style');
    }, 3000);
}

var surah = "";
$$('.open-surah-modal').on('click', function () {
    if(surah === "")
    {
        surah = '<div class="list-block"><ul>'
       $(quranXML).find('sura').each(function () {
           surah += '<li class="item-content" onClick="gotoSurah('+$(this).attr('index')+',1)">'+
                        '<div class="item-inner" >'+
                            '<div class="item-title" style="font-family:arabicFont">'+$(this).attr('name')+'</div>'+
                            '<div class="item-after"><span class="badge">'+$(this).attr('index')+'</span></div>'+
                        '</div>'+
                    '</li>'
       });
    }
  myApp.modal({
    title:  'Search by Surah',
    text: '<div>'+
            '<div style="height:200px;overflow: scroll">'+surah+'</div>'+
          '</div>',
    buttons: [
      {
        text: 'Cancel',
        bold: true,
      },
    ]
  })
});

$$('.open-ayah-modal').on('click', function () {
       var html =   '<table><tr>'+
                        '<td>SurahNo.</td><td><input id="sNo" type="number" style="width: 150px;"/></td></tr>'+
                        '<tr><td>AyahNo.</td><td><input id="aNo" type="number" style="width: 150px;"/></td>'+
                    '</tr></table>';
      
  myApp.modal({
    title:  'Search by Ayah',
    text: '<div>'+
            '<div>'+html+'</div>'+
          '</div>',
    buttons: [
      {
        text: 'Search',
        bold: true,
        onClick: function() {
            if($("#sNo").val() === "" && $("#aNo").val() === "")
            {
                
            }
            else
            {
                if($("#aNo").val() === "")
                    $("#aNo").val('1');
                if($("#sNo").val() === "")
                    $("#sNo").val(currentSurah);
                if($("#sNo").val()<=114)
                {
                    if(parseInt($("#aNo").val()) <= parseInt($(quranData).find('sura[index="'+$("#sNo").val()+'"]').attr('ayas')))
                        gotoSurah($("#sNo").val(),$("#aNo").val());
                    else
                        myApp.alert('Total Ayah of '+$(quranData).find('sura[index="'+$("#sNo").val()+'"]').attr('name')+' are '+$(quranData).find('sura[index="'+$("#sNo").val()+'"]').attr('ayas'), 'Limit exceed');
                }
                else
                    myApp.alert('Total Surah are 114', 'Limit exceed');
            }
        }
      },
      {
        text: 'Cancel',
        bold: true,
      },
    ]
  })
});
