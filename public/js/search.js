$(document).ready(function() {
  var search = function() {
    var query = $('#query').val();
    var request = gapi.client.youtube.search.list({
      q: query,
      type: 'video',
      part: 'snippet',
      maxResults: 15
    });

    request.execute(function(response) {
      $('#search-results').empty();

      for (var i = 0; i < response.result.items.length; ++i) {
        var item = response.result.items[i];
        var title = item.snippet.title;

        if (item.id.videoId) {
          var videoId = item.id.videoId;
          var link = '/?videoId=' + videoId;
          $('#search-results').append(
            '<div class="search-result">' +
              '<a href="' + link + '" class="video-link" id="' + videoId + '">' +
                title +
              '</a><br>' +
            '</div>'
          );
        }
      }
    });
  };

  $('#search-button').click(function() {
    search();
  });
  $('#query').on('keydown', function(e) {
    if (e.which == 13) {
      search();
    }
  });

  // Logic for autocomplete.
  $('#query').autocomplete({
    source: function(request, callback) {
      var query = request.term;
      $.ajax({
        dataType: 'jsonp',
        url: 'http://suggestqueries.google.com/complete/search?q=' + query + '&client=youtube&ds=yt',
        success: function(data) {
          var suggestions = [];
          $.each(data[1], function(key, val) {
            console.log(key + ', ' + val);
            suggestions.push(val[0]);
          });
          callback(suggestions);
        }
      });
    }
  });
});
