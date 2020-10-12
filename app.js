const express = require("express");
const bodyParser = require("body-parser");
//const date = require(__dirname + "/date.js"); // modulo locale
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemSchema = {
	name: {
		type: String,
		required: [true, "Specifie a name"]
	}
}

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item ({
	name: "Cosa1"
})
const item2 = new Item ({
	name: "Cosa2"
})
const item3 = new Item ({
	name: "Cosa3"
})

const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {
	//const day = date.getDate();
	Item.find({}, function(err, docs) {
		if(docs.length === 0){
			//insert default data
			Item.insertMany(defaultItems, function(err) {
				if(err){
					console.log(err);
				}else {
					console.log('Inserted default items!')
				}
			});
			res.redirect("/");
		}else{
			res.render('list', {listTitle: "Today", listItems: docs});
		}
	});
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