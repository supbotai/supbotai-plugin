<?php

if ( ! defined( 'ABSPATH' ) ) exit;

function supbotai_register_supbot_cpt() {

    $args = array(
        'labels'             => array(
            'name'                  => _x('SupBots', 'Post Type General Name', 'supbotai'),
            'singular_name'         => _x('SupBot', 'Post Type Singular Name', 'supbotai'),
        ),
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => false,
        'show_in_menu'       => false,
        'query_var'          => true,
        'rewrite'            => array('slug' => 'supbot'),
        'capability_type'    => 'post',
        'has_archive'        => false,
        'hierarchical'       => false,
        'menu_position'      => null,
        'supports'           => array('title', 'editor'),
        'show_in_rest'       => false,
    );

    register_post_type('supbotai_supbot', $args);
}
add_action('init', 'supbotai_register_supbot_cpt');
