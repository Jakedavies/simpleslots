var items = {1: 'fa-cube', 2: 'fa-beer', 3: 'fa-money'};
var minSpinTime = 2;

var spin = false;
var startSpinTime;
$(document).on('ready',function(){
    $('#spin-button').on('click',function(event){
        event.preventDefault();
        spin = true;
        startSpinTime = new Date();
        $.ajax({url: '/spin', method: 'post',context: document.body})
            .done(function(data){
            spin = false;
        });
        slotSpinAnimation();
    });
});
function slotSpinAnimation(){
    $('.slot').each(function() {
        $('.slot-item', $(this)).each(function () {
            randomNewValue($(this));
        });
    });
    // if we don't have a result for the spin, or the required time hasn't passed, keep spinning animation
    if(spin || !checkTimePassed()){
        setTimeout(function(){},100)
    }
}
function randomNewValue(item){
    //random number 1 to 3
    var chosenItem = Math.floor((Math.random() * 3) + 1);
    newValue(chosenItem,chosenItem)
};
function newValue(item,chosenItem){
    $('i',item).removeClass('fa-beer').removeClass('fa-money').removeClass('fa-cube')
        .addClass(items[chosenItem]);
}
function checkTimePassed(){
    return Math.floor((new Date() - startSpinTime)/1000) > minSpinTime;
};
function fillResult(){
    var slots = $('.slot');
    for(var i =0; i < slots.length;i++) {
        $('.slot-item', $(this)).each(function () {
            randomNewValue($(this));
        });
    };
}