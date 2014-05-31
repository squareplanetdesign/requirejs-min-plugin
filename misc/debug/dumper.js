/**
 * Function: dumper
 * Dumps the properties and values from an object.
 * Parameters:
 *   o   - [object] - Object you want to dump.
 *   has - [boolean] - If true, shows only properties on the object,
 *                     but not those inherited from prototype. If false
 *                     or undefined, shows all properties on the object
 *                     including those inherited from the prototype.
 * Returns:
 *   [string] Text version of the object.
 */
var dumper = function(o, has, spaces) {
    if (!o) {
        return "undefined\n";
    }

    if (!dumper.repeat) {
        // Silly way to make this self contained.
        dumper.repeat = function(num, txt) {
            if (!num) {
                return "";
            }
            return new Array(num + 1).join(txt);
        }
    }

    if (typeof spaces === "undefined") {
        spaces = 0;
    }

    var text = "";
    for (prop in o) {
        if (has && !o.hasOwnProperty(prop)) {
            continue;
        }

        var sub = o[prop];
        if (typeof sub === "object") {
            if (sub instanceOf Array) {
                text += "[\n" + dumper.repeat(spaces + 4, "\t") + dumper(sub) + "\n" + dumper.repeat(spaces, "\t") + "]"
            } else {
                text += "{\n" + dumper.repeat(spaces + 4, "\t") + dumper(sub) + "\n" + dumper.repeat(spaces, "\t") + "}"
            }
        } else {
            text += prop + ":" + o[prop] + "\n";
        }
    }
    return text;
};
//grunt.log.writeln("CONFIG:");
//grunt.log.write(dumper(data));
