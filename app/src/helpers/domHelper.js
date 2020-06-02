
export default class DOMHelper {

    static wrapTextNodes(dom) {
        const body = dom.body;
        let textNodes = [];
        // get all elements from iframe
        function recurse(element){
            element.childNodes.forEach(node => {
                // node is text and not 'empty'
                if(node.nodeName === "#text" && node.nodeValue.replace(/\s+/g, "").length > 0){
                    textNodes.push(node);
                } else {
                    recurse(node)
                }
            })
        }

        recurse(body);

        textNodes.forEach((node, i) => {
            //give wrapper each text node with custom editable tag
            const wrapper = dom.createElement('text-editor');
            node.parentNode.replaceChild(wrapper, node); //create wrapper
            wrapper.appendChild(node); //add wrapper
            wrapper.setAttribute("nodeid", i);
        });
        return dom
    };

    static unWrappedTextNodes(dom){
        //console.log("HELPER WAS INIT WITH THIS DOM", dom);
        dom.body.querySelectorAll("text-editor").forEach(element => {
            element.parentNode.replaceChild(element.firstChild, element);
        })
    };

    static parseStrToDOM(str){
        const parser = new DOMParser();
        return parser.parseFromString(str, "text/html");
    };

    static serializeDOMToString(dom){
        const serializer = new XMLSerializer();
        return serializer.serializeToString(dom);
    };

    static wrapImages(dom){
        dom.body.querySelectorAll("img").forEach((img, i) => {
            img.setAttribute("editable-img-id", i)
        });
        return dom
    }

    static unWrapImages(dom){
        dom.body.querySelectorAll("[editable-img-id]").forEach((img) => {
            img.removeAttribute("editable-img-id")
        });
    }

    static wrapDnd(dom){
        //const sections = dom.body.querySelectorAll('section');

        //return dom;
    }

};
