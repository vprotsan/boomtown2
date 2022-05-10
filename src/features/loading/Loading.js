import styles from '../loading/Loading.module.scss';

export function Loading() {

    return (
        <img className={styles.image} src={window.location.origin + '/images/loading_duck.gif'} />
    );
}