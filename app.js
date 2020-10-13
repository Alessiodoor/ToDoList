const express = require("express");
const bodyParser = require("body-parser");
//const date = require(__dirname + "/date.js"); // modulo locale
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});
mongoose.connect("mongodb+srv://root:root@cluster0.tydfh.mongodb.net/todolistDB", {useNewUrlParser: true});

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

const listSchema = {
	name: {
		type: String,
		require: true
	},
	items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {
	//const day = date.getDate();
	let lists = [];
	List.find({}, function(err, results) {
		if(!err){
			lists = results;
		}
	});

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
			res.render('list', {listTitle: "Today", listItems: docs, lists: lists});
		}
	});
});

app.post("/", function(req, res) {
	const itemName = req.body.newItem;
	const listName = req.body.list;

	const item = new Item({
		name: itemName
	});

	if(listName === "Today"){
		item.save();// aggiungo alla collection items
		res.redirect("/");
	}else {
		// cerco la lista custom e ci aggiungo l'item
		List.findOne({name: listName}, function(err, doc) {
			if(!err){
				doc.items.push(item);
				doc.save();
				res.redirect("/" + listName);
			}
		});
	}
})

app.post("/delete", function(req, res) {
	const checkedItemId = req.body.checkbox;
	const listName = req.body.listName;

	if(listName === "Today"){
		// remove item from default list
		Item.findByIdAndRemove(checkedItemId, function(err) {
			if(!err){
				console.log('Document deleted');
				res.redirect("/");
			}
		});
	}else {
		// find the custom list and remove the item 
		List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, doc) {
			if(!err){
				res.redirect("/" + listName);
			}
		});
	}
});

app.get("/:costumListName", function(req, res) {
	const listName = _.capitalize(req.params.costumListName);

	let lists = [];
	List.find({}, function(err, results) {
		if(!err){
			lists = results;
		}
	});

	List.findOne({name: listName}, function(err, doc) {
		if(!err){
			if(!doc){
				// creo una nuova lista
				const list = new List({
					name: listName,
					items: defaultItems
				});
				list.save();

				res.redirect("/" + listName);
			}else {
				res.render("list", {listTitle: listName, listItems: doc.items, lists: lists})
			}
		}
	});
}); 

app.get("/about", function(req, res) {
	res.render("about");
});

app.listen(3000, function(){
	console.log('Running on port 3000...');
});