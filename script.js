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
            $("#sentences").html('');
            data = $.parseJSON(data);
            $.each(data["sentences"], function(i, val) 
            {
                $("#sentences").append(CreateCheckbox(val["raw"], val["simplified"]));
                
                $("#sentences .checkbox").last().tooltip({
                    title: val["raw"],
                    placement: "top"
                });
            });
        });
    });

    $(document).on('click','.checkSentence',function(){
        if($(this).is(':checked')){
            var div = $(this).closest('div');
            $('#selected').append(div);
        }
        else{
            var div = $(this).closest('div');
            $('#sentences').append(div);
        }
        
    });
    
    function CreateCheckbox(raw, simplified)
    {
        var checkbox = "";
        
        checkbox += "<div class='checkbox'><label><input type='checkbox' class='checkSentence'>";
        
        checkbox += simplified;
        
        checkbox += "</label></div>"
        
        return checkbox;
    }
    
});
