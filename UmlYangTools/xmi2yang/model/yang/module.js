/********************************************************************************************************
 * Name: UML to YANG Mapping Tool
 * Copyright 2015 CAICT (China Academy of Information and Communication Technology (former China Academy of Telecommunication Research)). All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License").
 *
 * This tool is developed according to the mapping rules defined in onf2015.261_Mapping_Gdls_UML-YANG.08 by OpenNetworkFoundation(ONF) IMP group.
 *
 * file: \model\yang\module.js
 *
 * The above copyright information should be included in all distribution, reproduction or derivative works of this software.
 *
 ****************************************************************************************************/
var Util = require('./util.js');

function Module(name, namespace, imp, pref, org, contact, revis, descrp, fileName) {
    this.name = Util.yangifyName(name);
    this.namespace = namespace;
    this.import = [];
    this.prefix = pref;
    this.organization = org;
    this.contact = contact;
    this.revision = revis;
    this.description = descrp + "\r\n         - The TAPI YANG models included in this TAPI release are a *normative* part of the TAPI SDK.\r\n- The YANG specifications have been generated from the corresponding UML model using the [ONF EAGLE UML2YANG mapping tool]\r\n             <https://github.com/OpenNetworkingFoundation/EagleUmlYang>\r\n             and further edited manually to comply with the [ONF IISOMI UML2YANG mapping guidelines]\r\n             <https://wiki.opennetworking.org/display/OIMT/UML+-+YANG+Guidelines>\r\n         - Status of YANG model artifacts can be determined by referring to the corresponding UML artifacts.\r\n             As described in the UML models, some artifacts are considered *experimental*, and thus the corresponding YANG artifacts.\r\n         - The ONF TAPI release process does not guarantee backward compatibility of YANG models across major versions of TAPI releases.\r\n             The YANG model backward compatibility criteria are outlined in section 11 of <https://tools.ietf.org/html/rfc7950>.\r\n             YANG models included in this release may not be backward compatible with previous TAPI releases.";
    this.fileName = fileName;
    this.children = [];

}

Module.prototype.writeNode = function (layer) {
    var PRE = '';
    var k = layer;
    while (k-- > 0) {
        PRE += '\t';
    }
    var name = "module " + this.name;
    var namespace = !this.namespace || this.namespace === "" ? PRE + "\tnamespace ;\r\n" : PRE + "\tnamespace \"" + Util.yangifyName(this.namespace) + "\";\r\n";
    var imp = "";
    if (!this.import || this.import === []) {
        imp = "";
    } else {
        for (var i = 0; i < this.import.length; i++) {
            var impname = Util.yangifyName(this.import[i]);
            imp += PRE + "\timport " + impname + " {\r\n" + PRE + "\t\tprefix " + impname + ";\r\n" + PRE + "\t}\r\n";
        }
    }
    var pref = !this.prefix || this.prefix === "" ? PRE + "\tprefix ;\r\n" : PRE + "\tprefix " + this.prefix + ";\r\n";
    var org;
    if(!this.organization){
        this.organization = "ONF (Open Networking Foundation) IMP Working Group";
    }
    org = PRE + "\torganization \"" + this.organization + "\";\r\n";
    var contact = "";
    if(!this.contact){
        this.contact += "WG Web\: <https://www.opennetworking.org/technical-communities/areas/services/>\r\n";
        this.contact += "WG List\: <mailto: <wg list name>@opennetworking.org>\r\n";
        this.contact += "WG Chair: your-WG-chair\r\n";
        this.contact += "\t\t\<mailto:your-WG-chair@example.com>\r\n";
        this.contact += "Editor: your-name\r\n";
        this.contact += "\t\t\<mailto:your-email@example.com>";
    }
    //this.contact == "" || !this.contact ? contact = "" : contact = PRE + "\tcontact \"" + this.contact + "\";\r\n";
    this.contact = this.contact.replace(/\r\n/g, '\r\n' + PRE + '\t\t');
    contact = PRE + "\tcontact \"" + this.contact + "\";\r\n";
    var revision_stmt = "";
    for(var indx=0; indx<this.revision.length; indx++){
    var revis;
    //var date=new Date();
    /*if(this.revision.date == null || this.revision.date == ""){
        Date.prototype.Format = function (fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "S": this.getMilliseconds()
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
        revis = new Date().Format("yyyy-MM-dd");
    }else{*/
        revis = this.revision[indx].date;
    //}

    /*if(!this.revision){
        this.revision = "\r\ndescription \"Latest revision\";";
        this.revision += "\r\nreference \"RFC 6020 and RFC 6087\";";
    }else */
    var revision = "";
    if(typeof this.revision[indx] == "object"){
        for(var i in this.revision[indx]){
            if(i == "date"){
                continue;
            }
            revision += "\r\n" + i + " \"" + this.revision[indx][i] + "\";";
        }
        /*revision += "\r\ndescription \"" + this.revision.description + "\";";
        revision += "\r\nreference \"" + this.revision.reference + "\";";*/
    }
    revision = revision.replace(/\r\n/g, '\r\n' + PRE + '\t\t');
    revis = PRE + "\trevision " + revis + " {" + revision + "\r\n\t" + PRE + "}\r\n";
    //this.revision !== "" && this.revision ?  revis = PRE + "\trevision " + this.revision + "{}\r\n":revis =  PRE + "\trevision " + revis + "{}\r\n" ;
    revision_stmt = revision_stmt + revis;
    }
    var description;
    if(!this.description){
        this.description = "none";
    }
    if (typeof this.description == 'string') {
        this.description = this.description.replace(/\r+\n\s*/g, '\r\n' + PRE + '\t\t');
        this.description = this.description.replace(/\"/g,"\'");
    }
    description = PRE + "\tdescription \"" + this.description + "\";\r\n";
    var st = "";
    var sub;
    if (this.children) {
        for (var i = 0; i < this.children.length; i++) {
            if(sub){
                this.children[i - 1] = this.children[i];
            }
            if(this.children[i].name == "Interfaces"){
                sub = this.children[i];
            }
        }
        if(sub){
            this.children[this.children.length - 1] = sub;
        }
        for (var i = 0; i < this.children.length; i++) {
            st += this.children[i].writeNode(layer + 1);
        }
    }
    st = PRE + name + " {\r\n" +
        namespace +
        pref +
        imp +
        org +
        contact +
        description +
        revision_stmt +
        st + "}\r\n";
    return st;
};
module.exports = Module;
