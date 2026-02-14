import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';
export const alt = 'LA Crime Map - Real-Time Crime Statistics & Neighborhood Safety';
export const size = {
  width: 1200,
  height: 600,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: 'radial-gradient(circle at 25px 25px, white 2%, transparent 0%), radial-gradient(circle at 75px 75px, white 2%, transparent 0%)',
            backgroundSize: '100px 100px',
          }}
        />

        {/* Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          {/* Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100px',
              height: '100px',
              background: 'white',
              borderRadius: '25px',
              marginBottom: '30px',
              boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
            }}
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="#667eea"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="#667eea"
                fillOpacity="0.2"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="#667eea"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="#667eea"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
              marginBottom: '15px',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            LA Crime Map
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '32px',
              color: 'rgba(255,255,255,0.9)',
              margin: 0,
              marginBottom: '30px',
              maxWidth: '800px',
              lineHeight: 1.4,
            }}
          >
            Real-Time Crime Statistics & Neighborhood Safety
          </p>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              gap: '50px',
              marginTop: '15px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '42px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                35+
              </div>
              <div
                style={{
                  fontSize: '18px',
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                Neighborhoods
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '42px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                Real-Time
              </div>
              <div
                style={{
                  fontSize: '18px',
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                Data Updates
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '42px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                4+
              </div>
              <div
                style={{
                  fontSize: '18px',
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                Crime Types
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
