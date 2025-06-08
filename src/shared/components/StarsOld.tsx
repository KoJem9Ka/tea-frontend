import { Icon, Iconify } from '@/shared/components/Iconify';


type StarsProps = {
  value: number; // 0.00 -> 10.00
}

// Renders 5 stars
export function StarsOld(props: StarsProps) {
  const { value } = props;
  const fullStars = Math.floor(value / 2);
  const halfStar = value % 2 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className='flex items-center'>
      {Array.from({ length: fullStars }, (_, i) => (
        <Iconify icon={Icon.StarFilled} key={`full-${i}`} />
      ))}
      {halfStar && <Iconify icon={Icon.StarFilledHalf} />}
      {Array.from({ length: emptyStars }, (_, i) => (
        <Iconify icon={Icon.StarEmpty} key={`empty-${i}`} />
      ))}
    </div>
  );

}
