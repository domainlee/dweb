<?php
return array(
    'option_layout' => array (
        'label' => 'Tab sản phẩm',
        'type' => 'multifield',
        'fields' => array (
            'Tiêu đề tab 1' => array(
                'type' => 'text',
                'keyData' => 'option_title',
                'def' => 'Hello world',
            ),
            'Tiêu đề tab 2' => array(
                'type' => 'textarea',
                'keyData' => 'option_content',
                'def' => 'Good day',
            ),
            'Chọn ảnh' => array(
                'type' => 'file',
                'keyData' => 'option_image',
                'def' => '',
            ),
            'Slider' => array (
                'type' => 'checkbox',
                'keyData' => 'option_checked',
                'def' => 'true',
            ),
            'HTML' => array (
                'type' => 'texteditor',
                'keyData' => 'option_html',
                'def' => '',
            ),
            'HTML/CSS' => array (
                'type' => 'editorhtml',
                'keyData' => 'option_editor',
                'def' => '',
            ),
        ),
    ),
    'about_layout' => array (
        'label' => 'About',
        'type' => 'multifield',
        'fields' => array (
            'about title 1' => array(
                'type' => 'text',
                'keyData' => 'about_title',
                'def' => 'Welcome to site',
            ),
        ),
    ),
    'hero_layout' => array (
        'label' => 'Hero',
        'type' => 'repeater',
        'fields' => array (
            'Tiêu đề tab 1' => array(
                'type' => 'text',
                'keyData' => 'hero_title',
                'def' => 'Welcome to site',
            ),
            'Tiêu đề tab 2' => array(
                'type' => 'textarea',
                'keyData' => 'hero_content',
                'def' => 'The first, I am Mien Le',
            ),
        ),
    ),
);
?>