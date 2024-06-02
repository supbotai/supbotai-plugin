<?php

if ( ! defined( 'ABSPATH' ) ) exit;

function supbotai_add_admin_menu() {
    add_menu_page(
        'SupBot.Ai',                             // Page title
        'SupBot.Ai',                             // Menu title
        'manage_options',                        // Capability
        'supbotai-settings',                     // Menu slug
        'supbotai_settings_page',                // Function that outputs the page content.
        plugins_url('assets/images/supbotai-icon.svg', __FILE__),
        6
    );
}
add_action('admin_menu', 'supbotai_add_admin_menu');


function supbotai_settings_page() {
    ?>
    <div>
        <img style="width: 200px; padding-top: 20px" src="<?php echo esc_url(plugins_url('assets/images/supbotai-logo.png', __FILE__)) ?>" />
        <div id="supbotai-admin-page" class="supbotai-admin-page"></div>
    </div>
    <?php
}


function supbotai_sanitize_json_content($json_content) {
    $json_content = wp_unslash($json_content);

    $data_array = json_decode($json_content, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        return wp_json_encode(['error' => 'Invalid JSON data']);
    }

    $sanitized_data = ['nodes' => []];

    if (isset($data_array['nodes']) && is_array($data_array['nodes'])) {
        foreach ($data_array['nodes'] as $node) {
            $sanitized_node = [
                'name' => isset($node['name']) ? sanitize_text_field($node['name']) : '',
                'message' => isset($node['message']) ? sanitize_text_field($node['message']) : '',
                'responses' => []
            ];

            if (isset($node['responses']) && is_array($node['responses'])) {
                foreach ($node['responses'] as $response) {
                    $sanitized_response = [
                        'caption' => isset($response['caption']) ? sanitize_text_field($response['caption']) : '',
                        'action' => isset($response['action']) ? intval($response['action']) : 0
                    ];
                    $sanitized_node['responses'][] = $sanitized_response;
                }
            }

            $sanitized_data['nodes'][] = $sanitized_node;
        }
    }

    $sanitized_json_content = wp_json_encode($sanitized_data);

    if (json_last_error() !== JSON_ERROR_NONE) {
        return wp_json_encode(['error' => 'Error encoding JSON data']);
    }

    return $sanitized_json_content;
}


function supbotai_save_json_callback() {
    check_ajax_referer('supbotai_update_json', 'nonce');

    if (!current_user_can('edit_posts')) {
        wp_send_json_error('Unauthorized', 401);
        return;
    }

    if (!isset($_POST['post_id'], $_POST['json_content'])) {
        wp_send_json_error('Invalid Request', 404);
        return;
    }

    $post_id = absint($_POST['post_id']);
    if ($post_id === 0) {
        wp_send_json_error('Invalid Post ID', 400);
        return;
    }

    $json_content = supbotai_sanitize_json_content($_POST['json_content']);

    $update_result = wp_update_post(array(
        'ID'           => $post_id,
        'post_content' => $json_content,
    ));

    if (is_wp_error($update_result)) {
        error_log('Update failed: ' . $update_result->get_error_message());
        wp_send_json_error($update_result->get_error_message());
    } else {
        wp_send_json_success('JSON updated successfully!');
    }
}
add_action('wp_ajax_supbotai_save_json', 'supbotai_save_json_callback');
