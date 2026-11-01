


$(document).ready(function() {



// Next 
$('#mybutton').on('click', function() {
     $("#instafeed").fadeTo("slow", 1, function() {
        $(this).empty();

feed.next();
 })

});


//Set up instafeed
var feed = new Instafeed({
  get: 'user',
        userId: 1045837173,
        accessToken: '1045837173.6c82199.ba06d746d0724066acb485f9ea13d31a',
clientId: '6c8219977ab9440cbbf75d17df80e038',


sortBy: 'most-recent',
links: 'true',
limit: '4',
resolution: 'low_resolution',


template: '<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3"><div class="photo-box"><div class="image-wrap"><a href="{{link}}" target="_blank"><img src="{{image}}"></a><div class="likes">{{likes}} Likes</div></div><div class="description">{{caption}}<div class="date">{{model.date}}</div></div></div></div>',
useHttp: true,   // <--- add this





    });
feed.run();

});












//-->sortBy: 'most-recent',
//links: 'true',
//limit: '9',
//resolution: 'low_resolution',


//template: '<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3"><div class="photo-box"><div class="image-wrap"><a href="{{link}}"><img src="{{image}}"></a><div class="likes">{{likes}} Likes</div></div><div class="description">{{caption}}<div class="date">{{model.date}}</div></div></div></div>',
//useHttp: true,   // <--- add this