
/* Get The User Name From The Prompt*/
function getUserName(){
    var nameRegex = new RegExp('^[A-Za-z]+[A-Za-z\\s]+$');
    for(var i=1; i>0; i++){
        var userName = prompt("Please enter your name in a valid format");
        if (nameRegex.test(userName)) {
            console.log("getUserName() Done");
            getPassword();
            break;
        }
    }
}

/* Get The User Password From The Prompt*/
function getPassword(){
    var passRegex = new RegExp('^123$');
    var check=0;
    for(var i=0; i<3; i++){
        var pass = prompt("Please enter a password (123) to continue");
        if (passRegex.test(pass)) {
            console.log("getPassword() Done");
            check=1;
            getBirthMonth();
            break;
        }
    }
    if(check == 0) alert("Sorry, you’ve entered wrong password 3 times");
}

/* Get The User Birth Month From The Prompt*/
function getBirthMonth(){
    var monthRegex = new RegExp('^([1-9]|[1][0-2])$');
    var birthMonth;
    for(var i=1; i > 0; i++){
        birthMonth = prompt("Please enter your birth month as a number");
        if(monthRegex.test(birthMonth)) {
            console.log("getBirthMonth() Done");
            getBirthDay(birthMonth);
            break;
        }
    }
}

/* Get The User Birth Day From The Prompt*/
function getBirthDay(month){
    var dayRegex = new RegExp('^([1-9]|[1-2][0-9]|[3][0-1])$');
    var birthDay ;
    var months ={
        1:31, 2:28, 3:31, 4:30, 5:31, 6:30,
        7:31, 8:31, 9:30, 10:31, 11:30, 12:31 };
    month = Number(month);
    for(var i=1; i > 0; i++){
        var birthDay = prompt("Please enter your birth day");
        if(dayRegex.test(birthDay) && birthDay <= months[month]){
            console.log("getBirthDay() Done");
            getHoroscope(month, birthDay);
            break;
        }else alert("Please, Enter a valid day in your birth month");
    } 
}

/* Get The User Horoscope in alert*/
function getHoroscope(month, day){
    var horo = ["Aries - الحمل","Taurus - الثور","Gemini - الجوزاء","Cancer - السرطان","Leo - الأسد","Virgo - العذراء","Libra - الميزان","Scorpio - العقرب","Sagittarius - القوس","Capricorn - الجدي","Aquarius - الدلو","Pisces - الحوت"];
    // [[month, start day of horoscope, index of horoscope in horo array], [... , ... , ...], [... , ... , ...]]
    var horoDate = [[1,20,10],[2,19,11],[3,21,0],[4,20,1],[5,21,2],[6,22,3],[7,23,4],[8,23,5],[9,23,6],[10,24,7],[11,23,8],[12,22,9]];
    if(day >= horoDate[month-1][1]){
        console.log("getHoroscope() Done1");
        alert("Your Horoscope is : "+ horo[horoDate[month-1][2]] );
    } else {
        console.log("getHoroscope() Done2");
        if(horoDate[month-1][2] == 0) {
            alert("Your Horoscope is : "+ horo[11]);
        } else {
            alert("Your Horoscope is : "+ horo[horoDate[month-1][2]-1]);
        }
    }
}

getUserName();