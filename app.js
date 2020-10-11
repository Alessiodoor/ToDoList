const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js"); // modulo locale

const app = express();

app.set('view engine', 'ejs');

const items = [];
const workItems = [];
// NB: posso fare push su un array const, ma non posso fare una dichiarazione diretta 

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
	const day = date.getDate();

	res.render('list', {listTitle: day, listItems: items});
});

app.post("/", function(req, res) {
	const item = req.body.newItem;

	if(req.body.list == "Work"){
		workItems.push(item);
		res.redirect("/work");
	}else{
		items.push(item);	
		res.redirect("/");
	}

})

app.get("/work", function(req, res) {
	res.render("list", {listTitle: "Work list", listItems: workItems})
});

app.get("/about", function(req, res) {
	res.render("about");
});

app.listen(3000, function(){
	console.log('Running on port 3000...');
});