<?php

$content = file_get_contents('twitter.json');

$json = json_decode($content, true);

$new = '{ "name": "%s", "following" : "%s" },';

$result = '[';

foreach ($json['users'] as $tweet) {
    $result .= sprintf($new, $tweet['name'], $tweet['following']);
}

$result .= ']';

file_put_contents('twitter_new.json', $result);
