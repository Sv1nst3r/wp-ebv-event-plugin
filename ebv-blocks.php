<?php
/**
 * Plugin Name:       Ebv Blocks
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       ebv-blocks
 *
 * @package           create-block
 */

if (!defined('ABSPATH')) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function ebv_blocks_init()
{
	register_block_type(
		__DIR__ . '/build/events-grid',
		['render_callback' => 'ebv_dynamic_render'],
	);
}
add_action('init', 'ebv_blocks_init');

function ebv_dynamic_render($attributes)
{
	$args = array(
		'post_type' => 'ebv-events',
		'orderby' => 'event_date',
		'order' => 'ASC',
		'numberposts' => -1,
	);
	$posts = get_posts($args);
	if (count($posts) == 0) {
		return '<p>Pas d’article</p>';
	}
	$markup = '<div class="container-regular"><div class="actu-wrapper"><div class="actu_title-wrapper"><h2  class="actu__title" >Les évènements En Bonne Voix</h2></div>';
	foreach ($posts as $post) {
		$post_id = $post->ID;
		$eventDesc = get_field('event_desc', $post_id);
		$eventTitle = get_field('event_title', $post_id);
		$eventDate = get_field('event_date', $post_id);
		$eventUrl = get_field('event_url', $post_id);
		$eventMembers = get_field('event_members', $post_id);
		// Démarrage du cache d'affichage php
		ob_start();
		// inclusion du template
		include 'templates/event.php';
		// Récupération du HTML affiché via echo
		$markup .= ob_get_contents();
		ob_end_clean();
	}
	$markup .= '</div></div>';
	return $markup;
}
