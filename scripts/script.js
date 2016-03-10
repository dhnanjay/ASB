/**
 * Created by dhananjay on 3/9/16.
 */

// Global Variables Service Ticket
var gURL = 'http://colxd136.asa.hq.pvt:8002/sap/bc/webrfc?_FUNCTION=ZFM_MOBILE';
var sTick = '';
var gVendorID = '';
var prd = [];
// Get data from local storage
$(document).ready(function() {
    $('#usrname').val(localStorage.getItem("usr"));
    $('#pswd').val(localStorage.getItem("pswd"));
    gVendorID = localStorage.getItem("vendor");
});
// Login button -> Navigation to List Page
$(function() {
    $('#loginbtn').click(function(event) {
        var usr  = $('#usrname').val();
        var pswd = $('#pswd').val();
        var stDate = '';
        sTick = '';
        if (cOnline() == "offline") {
            event.preventDefault();
            return;
        }
        $.blockUI({ message: '<h3><img src="./CSS/img/slogo.png" /> Please Wait...</h3>',
            css: { border: '4px solid #6E6E6E',
                width:   '22%',
                backgroundColor:'#fff',
                opacity:     0.2,
                top:    '25%',
                left:   '40%' }  });
        $.ajax({
            url: gURL,
            dataType: 'json',
            type: 'POST',
            async: false,
            cache: false,
            crossDomain : true,
            data : {
                zname: 'LISTPAGE',
                usr : usr,
                pswd: pswd
            },
            success :  function(data){
                // Your Code here
                $.unblockUI();
                if (data === null) {
                    console.log('Invalid Login');
                    event.preventDefault();
                    $("#usrname").css("background", "#F0DDDD");
                    $("#usrname").css("border", "3px solid #EB6565");
                    $("#pswd").css("background", "#F0DDDD");
                    $("#pswd").css("border", "3px solid #EB6565");
                    return;
                }
                var remb = $('#toggleswitch2').val();
                if (remb == "on") {
                    localStorage.setItem("usr",usr);
                    localStorage.setItem("pswd",pswd);
                }
                $.each(data.VENDOR, function(index) {
                    if (stDate != data.VENDOR[index].POSTING_DATE ) {
                        var mT = dateFormatter(data.VENDOR[index].POSTING_DATE);
                        $('#listid').append( '<li'+ ' data-role="' + 'list-divider">' + mT + '</li>' );
                    }
                    $('#listid').append( '<li id=' + data.VENDOR[index].OBJECT_ID +
                    ' data-theme="' + 'a">' +'<a onClick="' + 'myfunction(this) "' +
                    ' href="' + '#page3"' + 'data-transition="' + 'slide">' +  '<h3>' + data.VENDOR[index].DESCRIPTION +
                    '</h3>' + '<p><strong>Service Ticket: ' +  data.VENDOR[index].OBJECT_ID + '</strong></p></a></li>'   );
                    stDate = data.VENDOR[index].POSTING_DATE;
                });
                gVendorID = data.VENDORID[0].VENDOR;
                localStorage.setItem("vendor",gVendorID);
            }
        }); // Ajax Ends
    }); // Click function ends
});   // function ends

// myfunction called from List page
function myfunction(a) {
    if (cOnline() == "offline") {
        event.preventDefault();
        return;
    }
    $.blockUI({ message: '<h3><img src="./CSS/img/slogo.png" /> Please Wait...</h3>',
        css: { border: '4px solid #6E6E6E',
            width:   '22%',
            backgroundColor:'#fff',
            opacity:     0.2,
            top:    '25%',
            left:   '40%' }  });
    sTick = '';
    var b = a.getElementsByTagName("STRONG")[0].textContent;
    var c = b.split("Service Ticket:");
    sTick = c[1];
    sTick = sTick.replace(/\s/g, '');
    var stDesc = a.getElementsByTagName("H3")[0].textContent;
    $('#cName').html('');
    $('#aDdr').html('');
    $('#sT').html('');
    $('#sTDesc').html('');
    $('#pName').html('');
    $('#pNDesc').html('');
    $('#Notes').html('');
    $.ajax({
        url: gURL,
        dataType: 'json',
        type: 'POST',
        async: false,
        cache: false,
        data: {
            zname: 'SELECT_ST',
            sTick: sTick
        },
        success: function(data) {
            // Your Code here
            try {
                $('#cName').append(data.PARTNER[0].ZZBUSINESSNA);
                $('#aDdr').append(data.PARTNER[0].HOUSE_NO + '  ' + data.PARTNER[0].STREET + '  ' + data.PARTNER[0].CITY +
                '  ' + data.PARTNER[0].REGION + '  ' + data.PARTNER[0].POSTL_COD1 + '<BR>' + 'Phone: ' +
                data.PARTNER[0].TELEPHONE + '<BR>' + 'Email: ' + data.PARTNER[0].E_MAIL);
                $('#sT').append(sTick);
                $('#sTDesc').append(stDesc);
                $('#pName').append('Product Name: ' + data.PARTNER[0].ORDERED_PROD);
                $('#pNDesc').append(data.PARTNER[0].DESCRIPTION);
                $.each(data.TEXT, function(index) { $('#Notes').append(data.TEXT[index].TDLINE); });
            } // try
            catch(err) {
                console.log(err.message);
            }
        }
    }); // Ajax Ends
    setTimeout($.unblockUI, 100);
} // Function ends
function dateFormatter(a) {
    var yR = a.substring(0, 4);
    var mT = a.substring(4, 6);
    mT = parseInt(mT, 10);
    var dY = a.substring(6, 8);
    switch (mT) {
        case 1:
            mT = "January";
            break;
        case 2:
            mT = "February";
            break;
        case 3:
            mT = "March";
            break;
        case 4:
            mT = "April";
            break;
        case 5:
            mT = "May";
            break;
        case 6:
            mT = "June";
            break;
        case 7:
            mT = "July";
            break;
        case 8:
            mT = "August";
            break;
        case 9:
            mT = "September";
            break;
        case 10:
            mT = "October";
            break;
        case 11:
            mT = "November";
            break;
        case 12:
            mT = "December";
            break;
    }
    mT = mT.concat(' ',dY,', ' ,yR);
    return mT;
}

$(function() {
    $('#helpSubmit').click(function(event) {
        if (cOnline() == "offline") {
            event.preventDefault();
            return;
        }
        var repagency = $('#repagency').val();
        if (repagency.length == 0) {
            $("#repagency").css("background", "#F0DDDD");
            $("#repagency").css("border", "3px solid #EB6565");
            event.preventDefault();
            return;
        }
        var emailip = $('#emailip').val();
        var phoneip = $('#phoneip').val();
        var hNote = $('#textarea2').val();
        var usr  = $('#usrname').val();
        var pswd = $('#pswd').val();
        if (usr.length == 0) { user = 'Not Available';}
        if (pswd.length == 0) { pswd = 'Not Available';}
        $.ajax({
            url: gURL,
            dataType: 'json',
            type: 'POST',
            async: false,
            cache: false,
            data: {
                zname: 'HELP',
                agency: repagency,
                email: emailip,
                phone: phoneip,
                text: hNote,
                usr: usr,
                pswd: pswd
            },
            success: function(data) {
                // Your Code here
                $("#repagency").val('');
                $("#repagency").css("background", "transparent none");
                $("#repagency").css("border", "0px solid #EB6565");
                $('#textarea2').val('Forget Password..');
            }
        })
    });
}); // function ends
$(function() {
    $('#confBtn').click(function(event) {
        if (cOnline() == "offline") {
            event.preventDefault();
            return;
        }
        $.blockUI({ message: '<h3><img src="./CSS/img/slogo.png" /> Please Wait...</h3>',
            css: { border: '4px solid #6E6E6E',
                width:   '22%',
                backgroundColor:'#fff',
                opacity:     0.2,
                top:    '25%',
                left:   '40%' }  })
        $('#sku').html('');
        $("#dateip").val('');
        $("#hoursip").val('');
        $("#textarea1").val('');
        prd = [];
        $.ajax({
            url: gURL,
            dataType: 'json',
            cache: false,
            async: false,
            data: {
                zname: 'CONFIRM',
                vendorid: gVendorID
            },
            success: function(data) {
                // Your Code here
                if (data == null) {
                    console.log('No SKU for Repair Agents');
                    event.preventDefault();
                }
                prd = data.STOCK;
                $('#dateip').val(cDate());
                $.each(data.STOCK, function(index) {
                    $('#sku').append('<div class="' + 'ui-block-a"' + '>' + '<div data-controltype="' + 'textblock"' + '>'
                    + '<p>' + data.STOCK[index].DESC + '&nbsp;' + '(' + data.STOCK[index].INH_QUANT + ')' + '</p></div></div><div class="' + 'ui-block-b"'
                    + '>' + '<div class="' + 'ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset" ' + ' data-controltype="' + 'textinput"'
                    + '>' + '<input id=' + '"' + data.STOCK[index].SKU + '"' + ' type="' + 'number'
                    + '" data-mini=' + '"true' + '"></div></div>' );
                });
            }
        }) // ajax ends
        setTimeout($.unblockUI, 100);
    }); // click ends
}); // function ends

$(function() {
    $('#submitBtn').click(function(event) {
        if (cOnline() == "offline") {
            event.preventDefault();
            return;
        }

        var prdVal = [];
        $.each(prd, function(index) {
            var uQuan = document.getElementById(prd[index].SKU).value;
            var pVal = prd[index].SKU + '-' + uQuan;
            prdVal.push(pVal);
        });
        var dat = document.getElementById('dateip').value;
        var stat = document.getElementById('statusdd').value;
        var hour = $('#hoursip').val();
        var sNote = document.getElementById('textarea1').value;
        if (dat.length == 0) {
            $("#dateip").css("background", "#F0DDDD");
            $("#dateip").css("border", "3px solid #EB6565");
            event.preventDefault();
            return;
        }
        else if (hour.length == 0) {
            $("#hoursip").css("background", "#F0DDDD");
            $("#hoursip").css("border", "3px solid #EB6565");
            event.preventDefault();
            return;
        }
        else if (sNote.length == 0) {
            $("#textarea1").css("background", "#F0DDDD");
            $("#textarea1").css("border", "3px solid #EB6565");
            event.preventDefault();
            return;
        }
        $.blockUI({ message: '<h3><img src="./CSS/img/slogo.png" /> Please Wait...</h3>',
            css: { border: '4px solid #6E6E6E',
                width:   '22%',
                backgroundColor:'#fff',
                opacity:     0.2,
                top:    '25%',
                left:   '40%' }  })
        $.ajax({
            url: gURL,
            dataType: 'json',
            type: 'POST',
            cache: false,
            //   processData: false,
            data: {
                zname: 'SUBMIT',
                prd: prdVal,
                date: dat,
                hour: hour,
                status: stat,
                notes: sNote,
                sTick: sTick,
                BPID: gVendorID
            },
            success: function(data) {
                // Your Code here
                var sTickID = '#' + sTick;
                $(sTickID).remove();
            }
        }) // Ajax ends
        setTimeout($.unblockUI, 2000);
    }); // click function ends
}); // function ends

// Function cDate =  get current date
function cDate() {
    var date = new Date();

// GET YYYY, MM AND DD FROM THE DATE OBJECT
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth()+1).toString();
    var dd  = date.getDate().toString();

// CONVERT mm AND dd INTO chars
    var mmChars = mm.split('');
    var ddChars = dd.split('');

// CONCAT THE STRINGS IN YYYY-MM-DD FORMAT
    var datestring = yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
    return (datestring);
} // function cDate ends

function cOnline() {
    if (window.navigator.onLine) {
        return null;
    } else {
        $.blockUI({ message: '<h3><img src="./CSS/img/slogo.png" /> No Internet !</h3>',
            css: { border: '4px solid #6E6E6E',
                width:   '22%',
                backgroundColor:'#fff',
                opacity:     0.8,
                top:    '25%',
                left:   '40%' }  });
        setTimeout($.unblockUI, 2200);
        return ("offline");
    }
}

