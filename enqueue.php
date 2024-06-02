<?php

if ( ! defined( 'ABSPATH' ) ) exit;

define('SUPBOTAI_VERSION', '1.1.4');
define('SUPBOTAI_DEFAULT_POST_CONTENT', '{"nodes":[{"name":"Start","message":"Hello and a warm welcome to [website name]! How can we assist you in finding the information you\'re looking for today?","responses":[{"caption":"[Topic A]","action":1},{"caption":"[Topic B]","action":2}]},{"name":"[Topic A] Info","message":"[more detailed description about topic A]. Did you find the info you\'ve been looking for?","responses":[{"caption":"Yes, Thank you.","action":3},{"caption":"Go Back","action":0}]},{"name":"[Topic B] Info","message":"[more detailed description about topic B]. Did you find the info you\'ve been looking for?","responses":[{"caption":"Yes, Thank you.","action":3},{"caption":"Go Back","action":0}]},{"name":"End","message":"Thank you for exploring our information. Have a great day!","responses":[]}]}');


function supbotai_enqueue_admin_scripts($hook) {

    if ('toplevel_page_supbotai-settings' === $hook) {

        wp_enqueue_style('dashicons');
        wp_enqueue_style('supbotai-admin-page-style', plugins_url('/assets/css/admin-page.css', __FILE__));
        wp_enqueue_script('supbotai-admin-page-script', plugins_url('/assets/js/admin-page.js', __FILE__), array('wp-element'), SUPBOTAI_VERSION, true);

        wp_enqueue_style('supbotai-chat-style', plugins_url('/assets/css/chat.css', __FILE__));
        wp_enqueue_script('supbotai-chat-script', plugins_url('/assets/js/chat.js', __FILE__), array(), SUPBOTAI_VERSION, true);

        $args = array(
            'post_type'      => 'supbotai_supbot',
            'posts_per_page' => 1,
        );
        $posts = get_posts($args);
    
        if (empty($posts)) {
            $default_json = SUPBOTAI_DEFAULT_POST_CONTENT;
    
            $post_id = wp_insert_post(array(
                'post_title'   => 'Default SupBot',
                'post_content' => $default_json,
                'post_status'  => 'publish',
                'post_type'    => 'supbotai_supbot',
            ));
            
            wp_localize_script('supbotai-admin-page-script', 'supbotai', array(
                'postId' => $post_id,
                'postJson' => $default_json
            ));
    
        } else {
            wp_localize_script('supbotai-admin-page-script', 'supbotai', array(
                'postId' => $posts[0]->ID,
                'postJson' => $posts[0]->post_content
            ));
        }

        wp_localize_script('supbotai-admin-page-script', 'supbotaiAjax', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('supbotai_update_json'),
        ));
    }
}
add_action('admin_enqueue_scripts', 'supbotai_enqueue_admin_scripts');


function supbotai_enqueue_scripts($hook) {
    wp_enqueue_style('supbotai-chat-style', plugins_url('/assets/css/chat.css', __FILE__));
    wp_enqueue_script('supbotai-chat-script', plugins_url('/assets/js/chat.js', __FILE__), array(), SUPBOTAI_VERSION, true);

    $args = array(
        'post_type'      => 'supbotai_supbot',
        'posts_per_page' => 1,
    );
    $posts = get_posts($args);

    if (!empty($posts)) {
        $encoded_json = wp_json_encode(json_decode($posts[0]->post_content, true));
        wp_localize_script('supbotai-chat-script', 'supbotai', array(
            'postId' => $posts[0]->ID,
            'postJson' => $encoded_json
        ));
    }
}
add_action('wp_enqueue_scripts', 'supbotai_enqueue_scripts');