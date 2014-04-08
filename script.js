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
    
    function parser_nejm_title(){
        html = content.find("#article");
        
        $("#sections").append("<li>abstract</li>");
        
        html.find(".section").each(function(){
            var title = $(this).find("h3").first().text().toLowerCase();
            
            if (title != ""){
                $("#sections").append("<li>" + title + "</li>");
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
    
    $("#sections").on("click", "li", function() {
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
                $("#parser").append(CreateCheckbox(val["simplified"]));
                
                $("#parser .checkbox").last().tooltip({
                    title: val["raw"],
                    placement: "top"
                });
            });
        })
        
    });
    
    function CreateCheckbox(simplified)
    {
        var checkbox = "";
        
        checkbox += "<div class='checkbox'><span class='checkSentence'>";
        
        checkbox += simplified;
        
        checkbox += "</span></div>"
        
        return checkbox;
    }
    
    

    $(document).on('click','.checkSentence',function(){
        var div = $(this).closest('div');
        if($(this).parent().parent().attr('id') == "parser"){
            div.append("<button class=\"btn btn-default copyBtn\" type=\"button\">Copy</button>");
            $('#selected').append(div);
            $('.copyBtn').zclip({
                path:'ZeroClipboard.swf',
                copy: $(this).parent().find("span").text()
            });
        }
        else{  
            div.find("button").remove()
            $('#parser').append(div);
        }
        
    });

    
    
});
