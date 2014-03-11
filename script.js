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
                $("#parser").append("<h3>" + title + "</h3>");
                $("#sections").append("<li>" + title + "</li>");
            }
            $(this).find("p").each(function(){
                $.post( "/",
                {
                    ajaxUrl: "true",
                    action: "simplifier",
                    value: $(this).text(),
                    async: false
                })
                .success(function(data)
                {
                    data = $.parseJSON(data);
                    
                    $.each(data["sentences"], function(i, val) 
                    {
                        $("#parser").append(CreateCheckbox(val["raw"], val["simplified"]));
                        
                        $("#parser .checkbox").last().tooltip({
                            title: val["raw"],
                            placement: "left"
                        });
                    });
                })
                            
            });      
        });
    }
    
    function CreateCheckbox(raw, simplified)
    {
        var checkbox = "";
        
        checkbox += "<div class='checkbox'><label><input type='checkbox'>";
        
        checkbox += simplified;
        
        checkbox += "</label></div>"
        
        return checkbox;
    }
    
});
