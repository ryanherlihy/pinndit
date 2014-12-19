function gen(target, cssClass, params) {
    var obj = $('#templates .upvote').clone();
    obj.addClass(cssClass);
    $(target).append(obj);
    return obj.upvote(params);
}

$(function() {
    function gen_examples(params) {
        gen('#examples', '', params);
    }
        var functions = [gen_examples];
        for (var i in functions) {
            var fun = functions[i];
            fun();
        }
});