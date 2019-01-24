'use strict';
class DoughRequest {
	constructor(tf, quantity, shape, diameter, length, width, flours, water, yeastType, yeast, salt, oil, sugar)  {
		this.shapeCheck = ["Round", "Rectangular"];

		this.setTf(tf);
		this.setQuantity(quantity);
		this.setShape(shape);
		this.setFlours(flours);
		this.setDiameter(diameter);
		this.setLength(length);
		this.setWidth(width);
		this.setWater(water);
		this.setYeastType(yeastType);
		this.setYeast(yeast);
		this.setSalt(salt);
		this.setOil(oil);
		this.setSugar(sugar);
		this.doughResult = new DoughResult(this);
		return this;
	}

	calculate() {
		return this.doughResult.getDoughResult();
	}

	parseURL(url) {
		var url = new URL(url);
        var query_string = url.search;
        var search_params = new URLSearchParams(query_string);

        this.setTf(search_params.get('thicknessFactor'));
        this.setDiameter(search_params.get('diameter'));
	    this.setShape(
        	(search_params.get('shape') == null) ? "Round" : search_params.get('shape')
        );
        this.setLength(search_params.get('length'));
        this.setWidth(search_params.get('diameter'));
        this.setQuantity(search_params.get('quantity'));
        this.setWater(search_params.get('water'));
	    this.setYeastType(
        	(search_params.get('yeast_type') == null) ? "IDY" : search_params.get('yeast_type')
        );
        this.setYeast(search_params.get('yeast'));
        this.setSalt(search_params.get('salt'));
        this.setSugar(search_params.get('sugar'));
        this.setOil(search_params.get('oil'));

        this.addFlour(new Flour(search_params.get('f0'), search_params.get('famt0')));
        this.addFlour(new Flour(search_params.get('f1'), search_params.get('famt1')));
        this.addFlour(new Flour(search_params.get('f2'), search_params.get('famt2')));

		return this;
	}

	getShareableURL(origin, pathname) {
		var _url = String(origin) + String(pathname);
		var params = [];

		if(this.getTf() != null && this.getTf() != 0)
	        params.push("thicknessFactor=" + encodeURIComponent(this.getTf()));

	    if(this.getQuantity() != null && this.getQuantity() != 0)
	        params.push("quantity=" + encodeURIComponent(this.getQuantity()));

	    if(this.getWater() != null && this.getWater() != 0)
	   		params.push("water=" + encodeURIComponent(this.getWater()));

	   	if(this.getYeastType() != null && this.getYeastType() != 0)
        	params.push("yeast_type=" + encodeURIComponent(this.getYeastType()));

        if(this.getYeast() != null && this.getYeast() != 0)
        	params.push("yeast=" + encodeURIComponent(this.getYeast()));

        if(this.getSalt() != null && this.getSalt() != 0)
        	params.push("salt=" + encodeURIComponent(this.getSalt()));

        if(this.getSugar() != null && this.getSugar() != 0)
        	params.push("sugar=" + encodeURIComponent(this.getSugar()));

        if(this.getOil() != null && this.getOil() != 0)
	        params.push("oil=" + encodeURIComponent(this.getOil()));

        params.push("shape=" + encodeURIComponent(this.getShape()));

        switch(this.getShape()) {
            case "Round":
                params.push("diameter=" + encodeURIComponent(this.getDiameter()))
                break;
            case "Rectangular":
                params.push("length=" + encodeURIComponent(this.getLength()));
                params.push("width=" + encodeURIComponent(this.getWidth()));
                break;
            default:
                break;
        }
        for(var f = 0; f < this.getFlours().length; f++) {
        	if(this.getFlours()[f].getName() != null && this.getFlours()[f].getName() != 0)
	        	params.push("f" + f + "=" + encodeURIComponent(this.getFlours()[f].getName()));
	        if(this.getFlours()[f].getAmount() != null && this.getFlours()[f].getAmount() != 0)
	        	params.push("famt" + f + "=" + encodeURIComponent(this.getFlours()[f].getAmount()));
        }

        return _url + "?" + params.join("&");
	}

	setTf(tf) {
		this.tf = Number(tf);
		return this;
	}

	setQuantity(quantity) {
		this.quantity = Number(quantity);
		return this;
	}

	setShape(shape) {
		if(shape == null) return this;
		if(!this.shapeCheck.includes(String(shape))) {
			throw "Unsupported shape: " + String(shape);
		}
		this.shape = shape;
		return this;
	}

	setDiameter(diameter) {
		this.diameter = Number(diameter);
		return this;
	}

	setLength(length) {
		this.length = Number(length);
		return this;
	}

	setWidth(width) {
		this.width = Number(width);
		return this;
	}

	setWater(water) {
		this.water = Number(water);
		return this;
	}

	setYeastType(yeastType) {
		this.yeastType = String(yeastType);
		return this;
	}

	setYeast(yeast) {
		this.yeast = Number(yeast);
		return this;
	}

	setSalt(salt) {
		this.salt = Number(salt);
		return this;
	}

	setOil(oil) {
		this.oil = Number(oil);
		return this;
	}

	setSugar(sugar) {
		this.sugar = Number(sugar);
		return this;
	}

	setFlours(flours) {
		if(flours == null) {
			this.flours = [];
			return this;
		}
		
		if(!Array.isArray(flours))
			throw "Must be an array of Flour"
		
		for(var f = 0; f < flours.length; f++) {
			if(!Flour.prototype.isPrototypeOf(flours[f])){
				throw "Must be an array of Flour";
			}
		}
		this.flours = flours;
		
		return this;
	}

	getFlourAmount() {
		if(this.getFlours().length == 0)
			return 100;

		var sum = 0;
		for(var f = 0; f < this.getFlours().length; f++) {
			sum += Number(this.getFlours()[f].getAmount());
		}
		return sum;

	}

	isValidFlourAmount() {
		if(this.getFlours().length == 0)
			return true;

		var sum = 0;
		for(var f = 0; f < this.getFlours().length; f++) {
			sum += Number(this.getFlours()[f].getAmount());
			if(sum > 100)
				return false;
		}
		return (sum == 100);
	}

	getTf() {
		return this.tf;
	}

	getQuantity() {
		return this.quantity;
	}

	getShape() {
		return this.shape;
	}

	getDiameter() {
		return this.diameter;
	}

	getLength() {
		return this.length;
	}

	getWidth() {
		return this.width;
	}

	getWater() {
		if(this.water == null) return 0;
		return this.water;
	}

	getYeastType() {
		return this.yeastType;
	}

	getYeast() {
		if(this.yeast == null) return 0;
		return this.yeast;
	}

	getSalt() {
		if(this.salt == null) return 0;
		return this.salt;
	}

	getOil() {
		if(this.oil == null) return 0;
		return this.oil;
	}

	getSugar() {
		if(this.sugar == null) return 0;
		return this.sugar;
	}

	getFlours() {
		return this.flours;
	}

	addFlour(flour) {
		if(Flour.prototype.isPrototypeOf(flour)){
			if(!flour.isEmpty())
				this.flours.push(flour);
		} else {
			throw "Not Flour";
		}
		return this;
	}
}

class DoughResult{
	constructor(doughRequest) {
		this.doughRequest = doughRequest;
		this.total_gram = 0;
		this.perball_gram = 0;
		this.flour_gram = 0;
		this.water_gram = 0;
		this.yeast_gram = 0;
		this.salt_gram = 0;
		this.oil_gram = 0;
		this.sugar_gram = 0;
	}

	getDoughResult(){
		switch(this.doughRequest.getShape()) {
          case "Round":
            this.setTotalGram(
            	Math.PI
            	* Math.pow(this.doughRequest.getDiameter() / 2, 2)
				* this.doughRequest.getTf()
				* this.doughRequest.getQuantity()
				* 28.35
			);
            break;
          case "Rectangular":
            this.setTotalGram(
            	this.doughRequest.getWidth()
            	* this.doughRequest.getLength()
            	* this.doughRequest.getTf()
            	* this.doughRequest.getQuantity()
            	* 28.35
            );
            break;
          default:
            this.setTotalGram(0);
        }

        this.setPerballGram(
        	this.getTotalGram() / this.doughRequest.getQuantity()
    	);
        this.setFlourGram(
        	this.getTotalGram() / (
        		1 + ((this.doughRequest.getWater() 
        					+ this.doughRequest.getYeast()
        					+ this.doughRequest.getSalt() 
				        	+ this.doughRequest.getOil() 
				        	+ this.doughRequest.getSugar()) / 100)
        		)
    	);

        this.setWaterGram(
        	this.flour_gram * (this.doughRequest.getWater() / 100)
    	);
        this.setYeastGram(
        	this.flour_gram * (this.doughRequest.getYeast() / 100)
    	);
        this.setSaltGram(
        	this.flour_gram * (this.doughRequest.getSalt() / 100)
    	);
        this.setOilGram(
        	this.flour_gram * (this.doughRequest.getOil() / 100)
    	);
        this.setSugarGram(
        	this.flour_gram * (this.doughRequest.getSugar() / 100)
    	);
		
		return this;
	}

	getTotalGram() {
		return this.total_gram;
	}

	getPerballGram() {
		return this.perball_gram;
	}

	getFlourGram() {
		return this.flour_gram;
	}

	getWaterGram() {
		return this.water_gram;
	}

	getYeastGram() {
		return this.yeast_gram;
	}

	getSaltGram() {
		return this.salt_gram;
	}

	getOilGram() {
		return this.oil_gram;
	}

	getSugarGram() {
		return this.sugar_gram;
	}

	setTotalGram(total_gram) {
		this.total_gram = Number(total_gram);
		return this;
	}

	setPerballGram(perball_gram) {
		this.perball_gram = Number(perball_gram);
		return this;
	}

	setFlourGram(flour_gram) {
		this.flour_gram = Number(flour_gram);
		return this;
	}

	setWaterGram(water_gram) {
		this.water_gram = Number(water_gram);
		return this;
	}

	setYeastGram(yeast_gram) {
		this.yeast_gram = Number(yeast_gram);
		return this;
	}

	setSaltGram(salt_gram) {
		this.salt_gram = Number(salt_gram);
		return this;
	}

	setOilGram(oil_gram) {
		this.oil_gram = Number(oil_gram);
		return this;
	}

	setSugarGram(sugar_gram) {
		this.sugar_gram = Number(sugar_gram);
		return this;
	}

	getHTMLTable() {
		var flour_rows = ""

		if(this.doughRequest.getFlours().length == 0){
			flour_rows += "<tr>";
			flour_rows += "<td>Flour</td>";
			flour_rows += "<td>" + this.getFlourGram().toFixed(2) + "</td>";
			flour_rows += "</tr>";
		} else {
			for(var f = 0; f < this.doughRequest.getFlours().length; f++){
				flour_rows += "<tr>";
				flour_rows += "<td>" + this.doughRequest.getFlours()[f].getName() + "</td>";
				flour_rows += "<td>" + (this.getFlourGram() * this.doughRequest.getFlours()[f].getAmount() / 100).toFixed(2) + "</td>";
				flour_rows += "</tr>";
			}
		}


		return `
			<table>
                    ${flour_rows}
                    <tr>
                        <td>Water (${this.doughRequest.getWater()}%)</td>
                        <td>${this.getWaterGram().toFixed(2)}g</td>
                    </tr>
                    <tr>
                        <td>Yeast (${this.doughRequest.getYeast()}%)</td>
                        <td>${this.getYeastGram().toFixed(2)}g</td>
                    </tr>
                    <tr>
                        <td>Salt (${this.doughRequest.getSalt()}%)</td>
                        <td>${this.getSaltGram().toFixed(2)}g</td>
                    </tr>
                    <tr>
                        <td>Oil (${this.doughRequest.getOil()}%)</td>
                        <td>${this.getOilGram().toFixed(2)}g</td>
                    </tr>
                    <tr>
                        <td>Sugar (${this.doughRequest.getSugar()}%)</td>
                        <td>${this.getSugarGram().toFixed(2)}g</td>
                    </tr>
                </table>
	        `;
	}
}

class Flour {
	constructor(name, amount) {
		this.name = name;
		this.amount = amount;
	}

	isEmpty() {
		return ((this.getName() == null || this.getName() == "") && (this.getAmount() == null || this.getAmount() == ""))
	}

	getName() {
		return this.name;
	}

	setName(name) {
		this.name = String(name);
		return this;
	}
	
	getAmount() {
		return this.amount;
	}
	
	setAmount(amount) {
		this.amount = Number(amount);
		return this;
	}
}