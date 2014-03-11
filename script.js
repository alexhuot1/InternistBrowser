$(document).ready(function() {

    var json = 
    {
        "sentences": 
        [
            {
                "raw":"bla bla bla",
                "simplified": "bla"
            },
            {
                "raw":"bla bla bla1",
                "simplified": "bla1"
            },
            {
                "raw":"bla bla bla2",
                "simplified": "bla2"
            },
            {
                "raw":"bla bla bla3",
                "simplified": "bla3"
            }

        ]
    }
    
    $('#submit').click(function(){
        $.post( "/", 
        {
            ajaxUrl: "true", 
            value: $('#raw').val() 
        })
        .success(function(data)
        {
            data = $.parseJSON(data);
            $.each(data["sentences"], function(i, val) 
            {
                $("#simplified").append(CreateCheckbox(val["raw"], val["simplified"]));
                
                $("#simplified .checkbox").last().tooltip({
                    title: val["raw"],
                    placement: "left"
                });
            });
        });
    });
    
    function CreateCheckbox(raw, simplified)
    {
        var checkbox = "";
        
        checkbox += "<div class='checkbox'><label><input type='checkbox'>";
        
        checkbox += simplified;
        
        checkbox += "</label></div>"
        
        return checkbox;
    }
    
});
