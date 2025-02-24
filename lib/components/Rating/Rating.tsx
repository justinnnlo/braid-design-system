import React from 'react';
import { useStyles } from 'sku/react-treat';
import assert from 'assert';
import { useBackground } from '../Box/BackgroundContext';
import useIcon, { UseIconProps } from '../../hooks/useIcon';
import { Box } from '../Box/Box';
import { Text, TextProps } from '../Text/Text';
import { IconStarSvg as IconStarEmptySvg } from '../icons/IconStar/IconStarSvg';
import { IconStarHalfSvg } from '../icons/IconStar/IconStarHalfSvg';
import { IconStarActiveSvg as IconStarFullSvg } from '../icons/IconStar/IconStarActiveSvg';
import * as styleRefs from './Rating.treat';

const getPercent = (rating: number, position: number) =>
  Math.round(Math.min(Math.max(rating - position, 0), 1) * 100);

type RatingStar = {
  percent: number;
} & UseIconProps;
const RatingStar = ({ percent, ...restProps }: RatingStar) => {
  const styles = useStyles(styleRefs);
  const currentBg = useBackground();
  const { className, ...iconProps } = useIcon(restProps);

  let component = IconStarEmptySvg;

  if (percent >= 25 && percent < 75) {
    component = IconStarHalfSvg;
  }

  if (percent > 50) {
    component = IconStarFullSvg;
  }

  return (
    <Box
      component={component}
      {...iconProps}
      className={[
        className,
        { [styles.starColor]: currentBg === 'body' || currentBg === 'card' },
      ]}
    />
  );
};

const ratingArr = [...Array(5)];
export interface RatingProps {
  rating: number;
  size?: TextProps['size'];
  showTextRating?: boolean;
  'aria-label'?: string;
}

export const Rating = ({
  rating,
  size = 'standard',
  showTextRating = true,
  'aria-label': ariaLabel,
}: RatingProps) => {
  const styles = useStyles(styleRefs);

  assert(
    !rating || (rating >= 0 && rating <= 5),
    'Rating must be between 0 and 5',
  );

  return (
    <Text size={size}>
      <Box
        display="inlineBlock"
        aria-label={
          ariaLabel || `${rating.toFixed(1)} out of ${ratingArr.length}`
        }
      >
        {ratingArr.map((_, position) => (
          <Box
            key={position}
            display="inlineBlock"
            aria-hidden={true}
            className={{
              [styles.starSpacing]: position !== ratingArr.length - 1,
            }}
          >
            <RatingStar percent={getPercent(rating, position)} />
          </Box>
        ))}
      </Box>
      {showTextRating && (
        <Box component="span" className={styles.textSpacing} aria-hidden={true}>
          {rating.toFixed(1)}
        </Box>
      )}
    </Text>
  );
};
