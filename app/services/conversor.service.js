(function () {
  'use strict';

  angular
    .module('dashboard')
    .service('conversorService', conversorService);

  conversorService.$inject = [];

  /**
   * @memberof dashboard
   * @ngdoc service
   * @name conversorService
   * @author  Stefan Goessner
   * @license Creative Commons GNU LGPL
   * @version 0.9
   * @desc Faz a transformação entre xml e json
   * @see Veja [Angular DOC]    {@link https://docs.angularjs.org/guide/services} Para mais informações
   * @see Veja [John Papa DOC]  {@link https://github.com/johnpapa/angular-styleguide/tree/master/a1#services} Para melhores praticas
   * @see License               {@link http://creativecommons.org/licenses/LGPL/2.1/}
   * @see Author site           {@link  http://goessner.net/}
   */
  function conversorService() {
    this.Json2Xml = Json2Xml;
    this.Xml2Json = Xml2Json;

    ////////////////

    /**
     * @function Json2Xml
     * @desc Consulta o cep fornecido e retorna os dados do local
     * @param {object} o - javascript object
     * @param {String} tab - tab or indent string for pretty output formatting.Omit or use empty string "" to supress.
     * @return {xml} xml string
     * @memberof conversorService
     */
    function Json2Xml(o, tab) {
      o = angular.fromJson(o);
      var toXml = function (v, name, ind) {
          var xml = "";
          if (v instanceof Array) {
            for (var i = 0, n = v.length; i < n; i++)
              xml += ind + toXml(v[i], name, ind + "\t") + "\n";
          } else if (typeof (v) == "object") {
            var hasChild = false;
            xml += ind + "<" + name;
            for (var m in v) {
              if (m.charAt(0) == "@")
                xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
              else
                hasChild = true;
            }
            xml += hasChild ? ">" : "/>";
            if (hasChild) {
              for (var m in v) {
                if (m == "#text")
                  xml += v[m];
                else if (m == "#cdata")
                  xml += "<![CDATA[" + v[m] + "]]>";
                else if (m.charAt(0) != "@")
                  xml += toXml(v[m], m, ind + "\t");
              }
              xml += (xml.charAt(xml.length - 1) == "\n" ? ind : "") + "</" + name + ">";
            }
          } else {
            xml += ind + "<" + name + ">" + v.toString() + "</" + name + ">";
          }
          return xml;
        },
        xml = "";
      for (var m in o)
        xml += toXml(o[m], m, "");
      return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
    }

    /**
     * @function String2Object
     * @desc transofrma um xml string em xml object
     * @param {String} xml - xml string
     * @return {xml}
     * @memberof conversorService
     */
    function String2Object(xml) {
      var parseXml;

      if (window.DOMParser) {
        parseXml = function (xmlStr) {
          return (new window.DOMParser()).parseFromString(xmlStr, 'text/xml');
        };
      } else if (typeof window.ActiveXObject != 'undefined' && new window.ActiveXObject('Microsoft.XMLDOM')) {
        parseXml = function (xmlStr) {
          var xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
          xmlDoc.async = 'false';
          xmlDoc.loadXML(xmlStr);
          return xmlDoc;
        };
      } else {
        parseXml = function () {
          return null;
        }
      }

      return parseXml(xml);
    }

    /**
     * @function Xml2Json
     * @desc Consulta o cep fornecido e retorna os dados do local
     * @param {xml} xml - element or document DOM node
     * @param {String} tab - tab or indent string for pretty output formatting.Omit or use empty string "" to supress.
     * @return {json} json string
     * @memberof conversorService
     */
    function Xml2Json(xml, tab) {
      xml = String2Object(xml); //converte de string para objeto
      var X = {
        toObj: function (xml) {
          var o = {};
          if (xml.nodeType == 1) { // element node ..
            if (xml.attributes.length) // element with attributes  ..
              for (var i = 0; i < xml.attributes.length; i++)
                o["@" + xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue || "").toString();
            if (xml.firstChild) { // element has child nodes ..
              var textChild = 0,
                cdataChild = 0,
                hasElementChild = false;
              for (var n = xml.firstChild; n; n = n.nextSibling) {
                if (n.nodeType == 1) hasElementChild = true;
                else if (n.nodeType == 3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                else if (n.nodeType == 4) cdataChild++; // cdata section node
              }
              if (hasElementChild) {
                if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                  X.removeWhite(xml);
                  for (var n = xml.firstChild; n; n = n.nextSibling) {
                    if (n.nodeType == 3) // text node
                      o["#text"] = X.escape(n.nodeValue);
                    else if (n.nodeType == 4) // cdata node
                      o["#cdata"] = X.escape(n.nodeValue);
                    else if (o[n.nodeName]) { // multiple occurence of element ..
                      if (o[n.nodeName] instanceof Array)
                        o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                      else
                        o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                    } else // first occurence of element..
                      o[n.nodeName] = X.toObj(n);
                  }
                } else { // mixed content
                  if (!xml.attributes.length)
                    o = X.escape(X.innerXml(xml));
                  else
                    o["#text"] = X.escape(X.innerXml(xml));
                }
              } else if (textChild) { // pure text
                if (!xml.attributes.length)
                  o = X.escape(X.innerXml(xml));
                else
                  o["#text"] = X.escape(X.innerXml(xml));
              } else if (cdataChild) { // cdata
                if (cdataChild > 1)
                  o = X.escape(X.innerXml(xml));
                else
                  for (var n = xml.firstChild; n; n = n.nextSibling)
                    o["#cdata"] = X.escape(n.nodeValue);
              }
            }
            if (!xml.attributes.length && !xml.firstChild) o = null;
          } else if (xml.nodeType == 9) { // document.node
            o = X.toObj(xml.documentElement);
          } else
            alert("unhandled node type: " + xml.nodeType);
          return o;
        },
        toJson: function (o, name, ind) {
          var json = name ? ("\"" + name + "\"") : "";
          if (o instanceof Array) {
            for (var i = 0, n = o.length; i < n; i++)
              o[i] = X.toJson(o[i], "", ind + "\t");
            json += (name ? ":[" : "[") + (o.length > 1 ? ("\n" + ind + "\t" + o.join(",\n" + ind + "\t") + "\n" + ind) : o.join("")) + "]";
          } else if (o == null)
            json += (name && ":") + "null";
          else if (typeof (o) == "object") {
            var arr = [];
            for (var m in o)
              arr[arr.length] = X.toJson(o[m], m, ind + "\t");
            json += (name ? ":{" : "{") + (arr.length > 1 ? ("\n" + ind + "\t" + arr.join(",\n" + ind + "\t") + "\n" + ind) : arr.join("")) + "}";
          } else if (typeof (o) == "string")
            json += (name && ":") + "\"" + o.toString() + "\"";
          else
            json += (name && ":") + o.toString();
          return json;
        },
        innerXml: function (node) {
          var s = ""
          if ("innerHTML" in node)
            s = node.innerHTML;
          else {
            var asXml = function (n) {
              var s = "";
              if (n.nodeType == 1) {
                s += "<" + n.nodeName;
                for (var i = 0; i < n.attributes.length; i++)
                  s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue || "").toString() + "\"";
                if (n.firstChild) {
                  s += ">";
                  for (var c = n.firstChild; c; c = c.nextSibling)
                    s += asXml(c);
                  s += "</" + n.nodeName + ">";
                } else
                  s += "/>";
              } else if (n.nodeType == 3)
                s += n.nodeValue;
              else if (n.nodeType == 4)
                s += "<![CDATA[" + n.nodeValue + "]]>";
              return s;
            };
            for (var c = node.firstChild; c; c = c.nextSibling)
              s += asXml(c);
          }
          return s;
        },
        escape: function (txt) {
          return txt.replace(/[\\]/g, "\\\\")
            .replace(/[\"]/g, '\\"')
            .replace(/[\n]/g, '\\n')
            .replace(/[\r]/g, '\\r');
        },
        removeWhite: function (e) {
          e.normalize();
          for (var n = e.firstChild; n;) {
            if (n.nodeType == 3) { // text node
              if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                var nxt = n.nextSibling;
                e.removeChild(n);
                n = nxt;
              } else
                n = n.nextSibling;
            } else if (n.nodeType == 1) { // element node
              X.removeWhite(n);
              n = n.nextSibling;
            } else // any other node
              n = n.nextSibling;
          }
          return e;
        }
      };
      if (xml.nodeType == 9) // document node
        xml = xml.documentElement;
      var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
      return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
    }
  }
})();