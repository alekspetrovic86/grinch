<?php declare(strict_types=1);
// default locale for maintenance translations
\define('DEFAULT_LOCALE', 'en');

// allow acces for following ips
$allowedIPs = [
    '127.0.0.1',
];

// translations for maintenance
$translations = [
    'en' => [
        'title' => 'Under construction',
        'heading' => 'Page under construction',
        'description' => 'This page is currently under construction. We are working on providing you with the best content soon. Thank you for your understanding!',
    ],
    'de' => [
        'title' => 'Wartungsarbeiten',
        'heading' => 'Seite im Aufbau',
        'description' => 'Diese Seite befindet sich derzeit im Aufbau. Wir arbeiten daran, Ihnen bald die besten Inhalte zu bieten. Vielen Dank für Ihr Verständnis!',
    ],
];

// check if ip is within allowed range
if (\in_array($_SERVER['REMOTE_ADDR'], $allowedIPs, true)) {
    return false;
}

// get language
$lang = \substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);

// chose locale
$locale = \array_key_exists($lang, $translations) ? $lang : DEFAULT_LOCALE;

\header('Content-Type: text/html; charset=utf-8');
\http_response_code(503);

?><!doctype html>
<html lang="<?php echo $locale; ?>">
<head>
    <title><?php echo $translations[$locale]['title']; ?></title>
    <style type="text/css">
        body {
            margin: 0;
            padding: 0;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: 
                linear-gradient(rgba(0, 0, 0, 0.50), rgba(0, 0, 0, 0.50)),
                url('cirih-under.png') no-repeat center center fixed;
            background-size: cover;
            color: #ffffff;
        }
        .content {
            text-align: center;
            max-width: 90%;
            box-sizing: border-box;
        }
        h1 {
            font-size: 2.5em;
            margin-bottom: 20px;
        }
        .description {
            font-size: 1.2em;
        }
    </style>
</head>
<body>
    <div class="content">
        <h1><?php echo $translations[$locale]['heading']; ?></h1>
        <div class="description"><?php echo $translations[$locale]['description']; ?></div>
    </div>
</body>
</html>
