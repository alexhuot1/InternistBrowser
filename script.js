$(document).ready(function() {

    var url = "http://www.nejm.org/doi/full/10.1056/NEJMoa1309199#t=article";
    $("#go").on("click", function(){
        if ($("#url").val() != ""){
            $.post( "/",
            {
                ajaxUrl: true,
                action: "extract",
                url: $("#url").val(),
            })
            .success(function(data)

            {
                $("#parser").html("");
                $("#sections").html("");
                parser(data);

            });
        }
    });

    function parser(data){
        var html = jQuery(data);
        html = html.find("#article");
        html.find(".section").each(function(){
            var title = $(this).find("h3").first().text();
            if (title != ""){
               // $("#parser").append("<h3>" + title + "</h3>");
                $("#sections").append("<li>" + title + "</li>");
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
