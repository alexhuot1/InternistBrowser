$(document).ready(function() {

    var nejm = "http://www.nejm.org/doi/full/10.1056/NEJMoa1309199#t=article";

    $("#go").on("click", function(){
        var url = $("#url").val();
        if (url != ""){
            $("#parser").html("");
            $("#sections").html("");
            $.post( "/",
            {
                ajaxUrl: true,
                action: "extract",
                url: $("#url").val(),
            })
            .success(function(data)
            {

                var parser;
                
                if (url.indexOf("nejm") > -1)
                    parser = parser_c("nejm");
                else if (url.indexOf("ascopubs") > -1)
                    parser = parser_c("ascopubs");
                else if (url.indexOf("bloodjournal") > -1)
                    parser = parser_c("bloodjournal");
                
                extractText(data, parser);

            });
        }
    });

    $("#load").on("click", function(){
        $.post( "/",
        {
            ajaxUrl: true,
            action: "loadCSV",
            csvPath: $("#csv").val()
        });
    });

    function extractText(data, parser){
        var html = jQuery(data);
        parser(html);
    }
    
    function parser_c(name)
    {
        switch(name){
            case "nejm":
                return parser_nejm;
            case "ascopubs":
                return parser_ascopubs;
            case "bloodjournal":
                return parser_bloodjournal;
            default:
                return 0;
        }

    }
    
    function parser_nejm(html){
        html = html.find("#article");
        html.find(".section").each(function(){
            var title = $(this).find("h3").first().text();
            if (title != ""){
                $("#sections").append("<li>" + title.toLowerCase() + "</li>");
            }
            $(this).find("p").each(function(){
                $.post( "/",
                {
                    ajaxUrl: "true",
                    action: "simplifier",
                    value: $(this).text()
                })
                .success(function(data)
                {
                    data = $.parseJSON(data);
                    
                    $.each(data["sentences"], function(i, val) 
                    {
                        $("#parser").append(CreateCheckbox(val["simplified"]));
                        
                        // $("#parser .checkbox").last().tooltip({
                        //     title: val["raw"],
                        //     placement: "top"
                        // });
                        $(".checkbox").last().find("b").each(function(){
                            // $(this).tooltip({
                            //     title: $(this).data("bookmark"),
                            //     placement: "top"
                            // });
                        
                        });
                    });
                })
                            
            });
        });
    }
    
    function parser_ascopubs(html){
        html = html.find(".article");
        html.find(".section").each(function(){
            var title = $(this).find("h2").text();
            if (title != ""){
                $("#sections").append("<li>" + title.toLowerCase() + "</li>");
            }
            $(this).find("p").each(function(){
                $.post( "/",
                {
                    ajaxUrl: "true",
                    action: "simplifier",
                    value: $(this).text()
                })
                .success(function(data)
                {
                    data = $.parseJSON(data);
                    
                    $.each(data["sentences"], function(i, val) 
                    {
                        $("#parser").append(CreateCheckbox(val["simplified"]));
                        
                        $("#parser .checkbox").last().tooltip({
                            title: val["raw"],
                            placement: "top"
                        });
                    });
                })
                            
            });
        });
    }
    
    function parser_bloodjournal(html){
        // Ne trouve pas le text de abstract
        html = html.find(".article");
        html.find(".section").each(function(){
            var title = $(this).find("h2").text();
            if (title != ""){
                $("#sections").append("<li>" + title.toLowerCase() + "</li>");
            }
            $(this).find("p").each(function(){
                $.post( "/",
                {
                    ajaxUrl: "true",
                    action: "simplifier",
                    value: $(this).text()
                })
                .success(function(data)
                {

                    data = $.parseJSON(data);
                    
                    $.each(data["sentences"], function(i, val) 
                    {
                        $("#parser").append(CreateCheckbox(val["simplified"]));
                        
                        $("#parser .checkbox").last().tooltip({
                            title: val["raw"],
                            placement: "top"
                        });
                    });
                })
                            
            });
        });
    }
    
    function CreateCheckbox(simplified)
    {
        var checkbox = "";
        
        checkbox += "<div class='checkbox'><button type=\"button\" class=\"btn btn-default btn-xs selectBtn\"><span class=\"glyphicon glyphicon-plus\"></span></button>&nbsp;<span class='checkSentence'>";
        
        checkbox += simplified;
        
        checkbox += "</span></div>";
        
        return checkbox;
    }
    
    

    $(document).on('click','button.selectBtn',function(){
        var div = $(this).closest('div');
        if($(this).parent().parent().attr('id') == "parser"){
            div.find("button").remove()
            div.prepend("<button class=\"btn btn-default btn-xs selectBtn\" type=\"button\"><span class=\"glyphicon glyphicon-minus\"></span></button>&nbsp;<button class=\"btn btn-default btn-xs copyBtn\" type=\"button\">Copy</button>&nbsp; ");
            $('#selected').append(div);
        }
        else{  
            div.find("button").remove()
            div.prepend("<button type=\"button\" class=\"btn btn-default btn-xs selectBtn\"><span class=\"glyphicon glyphicon-plus\"></span></button>")
            $('#parser').append(div);
        }

        $('#selected .copyBtn').each(function(){
            $(this).zclip({
                path:'ZeroClipboard.swf',
                copy: $(this).parent().find(".checkSentence ").text()
            });
        });
        $("#selected b").each(function(){
            $(this).zclip({
                path:'ZeroClipboard.swf',
                copy: $(this).data("bookmark")
            });
        });
    });

    
    
});
