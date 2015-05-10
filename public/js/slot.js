var items = {1: 'fa-cube', 2: 'fa-beer', 3: 'fa-money'};
var minSpinTime = 1;
var spin = false;
var credits = 0;

var startSpinTime, spinResult, winner, message;

//arm the spin button
$(document).on('ready',function(){
    $('#spin-button').on('click',function(event){
        event.preventDefault();
        beginSpin();

    });
});

//initialize the spin and kick off the ajax call
function beginSpin(){
    spin = true;
    startSpinTime = new Date();
    $('#spin-button').attr('disabled','disabled');
    $.ajax({url: '/spin', method: 'post',context: document.body})
        .success(function(data){
            console.log(data);
            spinResult = data.spinResult;
            message = data.message;
            credits = data.credits;
            winner = data.winner;
            spin = false;
        });
    displayMessage('');
    slotSpinAnimation();
}
//called at the end of number randomizing to update data
function endSpin(){
    $('#spin-button').removeAttr('disabled');
    displayMessage(message);
    updateCredits(credits);
    fillResult();
    if(winner){
        celebrate();
    }
}

function updateCredits(amount){
    console.log(amount);
    $('#credit-count').html(amount+' <i class="fa fa-diamond"></i>');
}
function slotSpinAnimation(){
    $('.slot').each(function() {
        $('.slot-item', $(this)).each(function () {
            randomNewItem($(this));
        });
    });
    // if we don't have a result for the spin, or the required time hasn't passed, keep spinning animation
    if(spin || !checkTimePassed()){
        setTimeout(function(){slotSpinAnimation()},100)
    }
    else{
        endSpin();
    }
}
//show those fireworks for 1.5 seconds
function celebrate(){
    $('.slot-container').addClass('celebrate');
    setTimeout(function(){$('.slot-container').removeClass('celebrate')},1500);
}
function displayMessage(text){
    $('#message-box').text(text);
}
function randomNewItem(item){
    //random number 1 to 3
    var chosenItem = Math.floor((Math.random() * 3) + 1);
    newItem(item,chosenItem)
};
//translates an integer into an icon
function newItem(item,chosenItem){
    $('i',item).removeClass('fa-beer').removeClass('fa-money').removeClass('fa-cube')
        .addClass(items[chosenItem]);
}
//verifies if the required spin time has passed or not
function checkTimePassed(){
    return Math.floor((new Date() - startSpinTime)/1000) > minSpinTime;
};
function fillResult(){
    var slots = $('.slot');
    for(var i =0; i < slots.length;i++) {
        var slotItems = $('.slot-item',slots[i]);
        console.log(slotItems);
        for(var j =0; j < slotItems.length;j++) {
            console.log(slotItems[j] + "value of "+spinResult[i+1][j]);
            newValue(slotItems[j],spinResult[i+1][j])
        };
    };
}