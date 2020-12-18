const moment=require('moment')

var local = moment("2020-12-17T11:16:33.403+00:00").local().format();
console.log(local, "- UTC now to local"); 