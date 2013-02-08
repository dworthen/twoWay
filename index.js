var dom = require('dom')
	, Emitter = require('emitter')
	, Obj = require('object')
	, map = require('map')
	, react = require('react')
	, clone = require('clone')
	, type = require('type')
	, text = require('text')
	, select = require('select')
	, model = require('model')
	, inherit = require('inherit')
	, isArray = require('isArray')
	, fs = require('fs');

var test = function() {
	this.name = 'Derek';
}	

test.prototype.getName = function() {
	return this.name;
};

var test2 = function() {
	
};

test2.prototype.getName = function() {
	return 'Cool ' + this.name;
};

var db = module.exports = function (opts, module) {
	if(module) {
		db.prototype = Obj.merge(db.prototype, module);
		return new db(opts);
	}

	this.attr = opts && opts.attr ? opts.attr : 'data-bind-';
	if (!opts || type(opts.prefix) === 'undefined' ) {
		this.prefix = true;
	} else {
		this.prefix = opts.prefix;
	}
	if (!opts || type(opts.equal) === 'undefined' ) {
		this.equal = false;
	} else {
		this.equal = opts.equal;
	}

	return this;
};

db.test = function() {
	inherit(test, test2);
	var t = new test();
	console.log(t.getName());
};
	
db.prototype.bind = function (html, data, fn) {
	var attrs = this.attrs = this.defineAttrs(data)
		, self = this;

	self.getHtml(html, function(err, results) {
		react(data).on('change', function(prop, newValue, oldValue) {
			dom('[' + attrs[prop] + ']', results).forEach(function(el, i) {
				self.updateEl(el, newValue);
			});
		});

		for(var key in attrs) {
			dom('[' + attrs[key] + ']', results).forEach(function(el, i) {
				self.updateEl(el, data[key]);
			}).on('change', function(e) {
				var re = new RegExp(self.attr)
					, att = map(this.attributes, function(val) {
							return val.name;
						});

				att = select(att, function(val) {
					return re.test(val);
				});

				for(var k in attrs) {
					if(attrs[k] === att[0]) {
						data[k] = this.value;
					}
				}			
			});
		}
		// console.log(dom('[' + attrs[key] + ']', results));
		fn(undefined, results);
	});

};

db.prototype.defineAttrs = function (data) {
	var keys = Obj.keys(data)
		, length = Obj.length(data)
		, self = this
		, attrs = {};

	for(var i = 0; i < length; i++) {
		attrs[keys[i]] = self.prefix ? self.attr + keys[i] : self.attr;
	}
	if(this.equal) {
		for(var i = 0; i < length; i++) {
			attrs[keys[i]] += '="' + keys[i] + '"';
		}
	}
	return attrs;
}

db.prototype.updateEl = function (el, newVal) {
	var tagName = el.tagName.toLowerCase();
	if ( tagName === "input" || tagName === "textarea" || tagName === "select" ) {
    el.value = newVal;
  } else {
    el.innerHTML = newVal;
  }
}

db.prototype.getHtml = function(html, fn) {

	fn(undefined, dom(html));

	// fs.readString(html, function(err, results) {
	// 	// if(err) throw err;
	// 	fn(undefined, html);
	// });
};


		// Emitter(data);

		// if(this.method) {
		// 	Emitter(data);

		// 	data.on('change', function(prop, newValue, oldValue) {
		// 		dom('[' + attrs[prop] + ']', html).forEach(function(el, i) {
		// 			this.updateEl(el, newValue);
		// 		});
		// 	});

		// 	var curMethod = isArray(self.method) ? self.method : [].push(self.method);
		// 	for(var i = 0; i < curMethod.length; i++) {
		// 		var meth = data[curMethod[i]];
		// 		data[curMethod[i]] = function(val) {
		// 			meth(val);
		// 			data.emit('change', curMethod[i], val);
		// 		};
		// 	}
		// } else {