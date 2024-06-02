<?php
/**
 * Plugin Name: SupBot.Ai
 * Description: Plug Into ChatGPT's Power: Effortlessly enhance your website with our AI chatbot plugin. Provide instant, accurate responses to customer inquiries, streamline support, and elevate user engagement with cutting-edge conversational AI.
 * Version: 0.1.0
 * Author: SupBot.Ai
 * Author URI: https://supbot.ai
 * License: GPL2
 */

if ( ! defined( 'ABSPATH' ) ) exit;

include 'enqueue.php';
include 'custom-post-type.php';
include 'admin-page.php';