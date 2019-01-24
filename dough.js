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

        this.setTf(
        	(search_params.get('thicknessFactor') == null) ? 0.075 : search_params.get('thicknessFactor')
        );

        this.setDiameter(
        	(search_params.get('diameter') == null) ? 11 : search_params.get('diameter')
        );
        this.setShape(
        	(search_params.get('shape') == null) ? "Round" : search_params.get('shape')
        );
        this.setLength(
        	(search_params.get('length') == null) ? 11 : search_params.get('length')
        );
        this.setWidth(
        	(search_params.get('diameter') == null) ? 11 : search_params.get('diameter')
        );
        this.setQuantity(
        	(search_params.get('quantity') == null) ? 2 : search_params.get('quantity')
        );
        this.setWater(
        	(search_params.get('water') == null) ? 65 : search_params.get('water')
        );
	    this.setYeastType(
        	(search_params.get('yeast_type') == null) ? "IDY" : search_params.get('yeast_type')
        );
        this.setYeast(
        	(search_params.get('yeast') == null) ? 0.5 : search_params.get('yeast')
        );
        this.setSalt(
        	(search_params.get('salt') == null) ? 2.5 : search_params.get('salt')
        );
        this.setSugar(
        	(search_params.get('sugar') == null) ? 0.0 : search_params.get('sugar')
        );
        this.setOil(
        	(search_params.get('oil') == null) ? 0.0 : search_params.get('oil')
        );

		return this;
	}

	getShareableURL(origin, pathname) {
		var _url = String(origin) + String(pathname);
        _url += "?thicknessFactor=" + encodeURIComponent(this.tf);
        _url += "&quantity=" + encodeURIComponent(this.quantity);
        _url += "&water=" + encodeURIComponent(this.water);
        _url += "&yeast_type=" + encodeURIComponent(this.yeastType);
        _url += "&yeast=" + encodeURIComponent(this.yeast);
        _url += "&salt=" + encodeURIComponent(this.salt);
        _url += "&sugar=" + encodeURIComponent(this.sugar);
        _url += "&oil=" + encodeURIComponent(this.oil);
        _url += "&shape=" + encodeURIComponent(this.shape);
        switch(this.shape) {
            case "Round":
                _url += "&diameter=" + encodeURIComponent(this.diameter)
                break;
            case "Rectangular":
                _url += "&length=" + encodeURIComponent(this.length);
                _url += "&width=" + encodeURIComponent(this.width);
                break;
            default:
                break;
        }
        for(var f = 0; f < this.getFlours().length; f++) {
        	_url += "&f" + f + "=" + encodeURIComponent(this.getFlours()[f].getName());
        	_url += "&famt" + f + "=" + encodeURIComponent(this.getFlours()[f].getAmount());
        }

        return _url;
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

	isValidFlourAmount() {
		if(this.getFlours().length == 0)
			return true;

		var sum = 0;
		for(var f = 0; f < this.getFlours().length; f++) {
			sum += this.getFlours()[f].getAmount();
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
			this.flours.push(flour);
		}
		else {
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
		return `
			<table>
                    <tr>
                        <td>Flour</td>
                        <td>${this.getFlourGram().toFixed(2)}g</td>
                    </tr>
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