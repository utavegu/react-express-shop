import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { productsSlice } from '../../store/products.slice';
import { basketSlice } from '../../store/basket.slice';
import { prettifyCost } from '../../helpers/prettifyCost';
import Wrapper from '../../layouts/Wrapper/Wrapper';
import ColorsList from '../../components/ColorsList/ColorsList';
import Button from '../../components/Button/Button';
import styles from './ProductPage.module.css';

const ProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      productsSlice.fetchTargetProduct(id);
    }
  }, [id]);

  if (productsSlice.isLoading) {
    // TODO: Спиннер
    return <div>Загрузка данных о товаре...</div>;
  }

  const product = productsSlice?.product;

  return (
    <Wrapper>
      {productsSlice.error && <div>Ошибка загрузки данных о товаре: {productsSlice.error.message}</div>}
      <section className={styles.productPage}>
        <Button
          variant="tertiary"
          onClick={() => navigate(-1)}
        >
          Назад
        </Button>
        {product && (
          <div>
            <div className={styles.imageContainer}>
              <img
                src={product?.image}
                alt={productsSlice.product?.name}
              />
            </div>
            <h2 className={styles.productHeaing}>{product?.name}</h2>
            <ColorsList colors={product?.colors} />
            <div className={styles.price}>{prettifyCost(product?.price)}₽</div>
            <Button
              variant="primary"
              onClick={() => {
                basketSlice.pushProductInBasket(product);
              }}
            >
              В корзину
            </Button>
            <div className={styles.descriptionBlock}>
              <h3 className={styles.descriptionHeading}>Описание</h3>
              <p className={styles.content}>{product?.desc}</p>
            </div>
          </div>
        )}
      </section>
    </Wrapper>
  );
};

export default observer(ProductPage);
