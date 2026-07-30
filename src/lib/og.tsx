// Shared layout for file-based dynamic OG images (src/app/**/opengraph-image.tsx).
// Kept as plain JSX-returning functions (no hooks/client state) so it can be embedded
// directly into a next/og ImageResponse tree, which is rendered by Satori and only
// understands a restricted, explicitly-flexbox subset of CSS.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

const BRAND_GRADIENT = 'linear-gradient(135deg, #0b0f19 0%, #1a0f1f 55%, #0b0f19 100%)';

interface OgCardProps {
  kind: string;
  title: string;
  subtitle?: string;
  meta?: string;
  rating?: number | null;
  imageUrl?: string | null;
  imageShape?: 'poster' | 'circle';
}

export function OgCard({ kind, title, subtitle, meta, rating, imageUrl, imageShape = 'poster' }: OgCardProps) {
  const titleSize = title.length > 34 ? 52 : title.length > 20 ? 60 : 72;
  const isCircle = imageShape === 'circle';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundImage: BRAND_GRADIENT,
        padding: '64px',
        fontFamily: 'sans-serif',
        position: 'relative',
      }}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- rendered by Satori (next/og), not the DOM; next/image doesn't apply here.
        <img
          src={imageUrl}
          alt=""
          width={isCircle ? 380 : 320}
          height={isCircle ? 380 : 480}
          style={{
            borderRadius: isCircle ? 9999 : 28,
            objectFit: 'cover',
            border: '2px solid rgba(255,255,255,0.12)',
          }}
        />
      ) : null}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginLeft: imageUrl ? 56 : 0,
          flex: 1,
          gap: 22,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignSelf: 'flex-start',
            backgroundColor: 'rgba(225,29,72,0.22)',
            color: '#fb7185',
            border: '1px solid rgba(225,29,72,0.45)',
            borderRadius: 999,
            padding: '8px 22px',
            fontSize: 22,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 3,
          }}
        >
          {kind}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: titleSize,
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.08,
            maxWidth: 720,
          }}
        >
          {title}
        </div>

        {subtitle ? (
          <div style={{ display: 'flex', fontSize: 26, fontWeight: 600, color: '#9ca3af' }}>{subtitle}</div>
        ) : null}

        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 28 }}>
          {rating != null && rating > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Plain rounded chip instead of a star glyph — Satori's default font has
                  no glyph for U+2605 and renders it as a missing-character box. */}
              <div
                style={{
                  display: 'flex',
                  fontSize: 18,
                  fontWeight: 800,
                  color: '#0b0f19',
                  backgroundColor: '#fbbf24',
                  borderRadius: 8,
                  padding: '4px 10px',
                }}
              >
                RATING
              </div>
              <span style={{ display: 'flex', fontSize: 34, fontWeight: 800, color: '#fbbf24' }}>
                {rating.toFixed(1)}
              </span>
              <span style={{ display: 'flex', fontSize: 22, fontWeight: 600, color: '#6b7280' }}>/ 10</span>
            </div>
          ) : null}
          {meta ? (
            <span style={{ display: 'flex', fontSize: 24, fontWeight: 600, color: '#9ca3af' }}>{meta}</span>
          ) : null}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          position: 'absolute',
          bottom: 48,
          right: 64,
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundImage: 'linear-gradient(135deg, #e11d48 0%, #fb7185 100%)',
          }}
        />
        <span style={{ display: 'flex', fontSize: 28, fontWeight: 800, color: '#ffffff' }}>CineStream</span>
      </div>
    </div>
  );
}
