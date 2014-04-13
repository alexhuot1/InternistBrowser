$(document).ready(function() {

    var nejm = "http://www.nejm.org/doi/full/10.1056/NEJMoa1309199#t=article";

    var parser;
    var content;
    
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
                content = jQuery(data);
                
                if (url.indexOf("nejm") > -1) {
                    parser_nejm_title();
                    parser = parser_nejm;
                }
                else if (url.indexOf("ascopubs") > -1 || url.indexOf("bloodjournal") > -1) {
                    parser_ascopubs_title();
                    parser = parser_ascopubs;
                }
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

    
    function parser_nejm_title(){
        html = content.find("#article");
        
        $("#sections").append("<li><a href=\"#\">abstract</a></li>");
        
        html.find(".section").each(function(){
            var title = $(this).find("h3").first().text().toLowerCase();
            
            if (title != ""){
                $("#sections").append("<li><a href=\"#\">" + title + "</a></li>");
            }
        });
    }
    
    function parser_nejm(section) {
        var text = "";
        var html = content.find("#article");
        
        if (section == "abstract") {
            html = html.find(".section").first();
            html.find("p").each(function(){
                text += $(this).text();
            });
        }
        
        html.find(".section").each(function(){
            var title = $(this).find("h3").first().text().toLowerCase();
            
            if (title == section){
                $(this).find("p").each(function(){
                    text += $(this).text();
                });
            }
        });
        
        return text;
    }
    
    function parser_ascopubs_title() {
        html = content.find(".article");
        
        html.find(".section").each(function(){
            var title = $(this).find("h2").text().toLowerCase();
            
            if (title != ""){
                $("#sections").append("<li>" + title + "</li>");
            }
        });
    }
    
    function parser_ascopubs(section){
        var text = "";
        var html = content.find(".article");
        
        html.find(".section").each(function(){
            var title = $(this).find("h2").text().toLowerCase();
            
            if (title == section){
                $(this).find("p").each(function(){
                    text += $(this).text();
                });
            }
        });
    }
    
    $("#sections").on("click", "a", function(event) {
        event.preventDefault();
        $("#parser").html("");
        
        var text = parser($(this).text());
        
        $.post( "/",
        {
            ajaxUrl: "true",
            action: "simplifier",
            value: text
        })
        .success(function(data)
        {
            data = $.parseJSON(data);
            
            $.each(data["sentences"], function(i, val) 
            {
                $("#parser").append(CreateCheckbox(val));
            });
        })
        
    });
    
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

    $("#close").click(function(){
        $.post( "/",
            {
                ajaxUrl: true,
                action: "closeApp"
            }) .
            success(function(data)
            {
                window.close();
            });
    });

    $('#ajaxLoader').hide();
    $(document).ajaxStart(function() {
        $('#ajaxLoader').fadeIn()
    });
    $(document).ajaxStop(function() {
        $('#ajaxLoader').fadeOut()
    });
    
});
