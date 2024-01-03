/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import {
	__
} from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	useBlockProps
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { Spinner } from '@wordpress/components';
/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit(props) {
	const blockProps = useBlockProps();

	// Récupération dynamique des articles
	const posts = useSelect(select => {
		return select('core').getEntityRecords('postType', 'ebv-events', {
			per_page: 3
		})
	});


	// L'API n'a pas encore répondu
	if ( ! posts ) {
		return (
			<div { ...blockProps }>
				<p className="capitaine-placeholder">
					<Spinner />
					{ __( 'Chargement des évènements', 'capitainewp-gut-bases' ) }
				</p>
			</div>
		)
	}

	// L'API a répondu mais aucun article ne correspond aux critères
	if ( posts.length === 0 ) {
		return (
			<div { ...blockProps }>
				<p className="capitaine-placeholder">
					{ __( `Pas d'évènement`, 'capitainewp-gut-bases' ) }
				</p>
			</div>
		)
	}

	// L'API a répondu avec des résultats à afficher
	return (
		<ul { ...blockProps }>
			<div class='container-regular'>
			{ posts.map( post => {
				return (
					<div class="actu_item">
					<div class="actu-info-wrapper">
						<h4 class="actu__date">{post.acf.event_date}</h4>
						<h2 class="actu__title">
						{post.acf.event_title}
						</h2>
						<h4 class="actu__authors">{post.acf.event_members}</h4>
					</div>
				</div>
				
					)
			} 
			)
			 }
			 </div>
		</ul>
	)
}

