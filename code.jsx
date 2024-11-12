import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import './exx.css'
const tabs = ['001', '002', '003'];

function Section() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [active, setActive] = useState('001');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: '0%', width: '1%' });
  const [visibleTabs, setVisibleTabs] = useState({});
  const boxRefs = useRef({});
  const observer = useRef(null);
  const visibilityTimer = useRef({});

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
  
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) {
      observer.current = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const { target, isIntersecting } = entry;
          const tab = target.dataset.tab;

          clearTimeout(visibilityTimer.current[tab]);

          if (isIntersecting) {
            visibilityTimer.current[tab] = setTimeout(() => {
              setActive(tab);
              updateIndicator(tab);
              setVisibleTabs(prev => ({ ...prev, [tab]: true }));
            }, 10); //.01sec
          } else {
            setVisibleTabs(prev => ({ ...prev, [tab]: false }));
          }
        });
      }, { threshold: 0.5 });

      Object.values(boxRefs.current).forEach(box => {
        if (box) {
          observer.current.observe(box);
        }
      });
    }

    return () => {
      if (observer.current) {
        Object.values(boxRefs.current).forEach(box => {
          if (box) {
            observer.current.unobserve(box);
          }
        });
      }
    };
  }, [isMobile]);

  const updateIndicator = (tab) => {
    const activeIndex = tabs.indexOf(tab);
    const tabWidth = 100 / tabs.length;
    const targetLeft = (activeIndex * tabWidth + 10) + '%';
    const targetWidth = (tabWidth - 22) + '%';
    setIndicatorStyle({
      left: targetLeft,
      width: targetWidth,
    });
  };

  const goTo = (tab) => {
    const element = document.getElementById(`no-${tab}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderDesktopLayout = () => (
    <section className='no-content'>
      {tabs.map((tab) => (
        <div
          className={`no-${tab} no-box`}
          id={`no-${tab}`}
          ref={el => boxRefs.current[tab] = el}
          data-tab={tab}
          key={tab}
        >
          <motion.div className='no-box-details'>
            <motion.h2
              initial={{ opacity: 0, y: 500, filter: 'blur(100px)' }}
              animate={visibleTabs[tab] ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 100, filter: 'blur(10px)' }}
              transition={{ duration: 1 }}
            >
              {tab === '001' ? 'zero zero one' : tab === '002' ? 'zero zero two' : 'zero zero three'}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 500, filter: 'blur(100px)' }}
              animate={visibleTabs[tab] ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 100, filter: 'blur(10px)' }}
              transition={{ duration: 1.1 }}
            >
              {
                tab === '001' ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet sapien non arcu volutpat tincidunt. Curabitur vestibulum malesuada orci vel suscipit. Nullam a erat sed purus gravida mollis. Phasellus sollicitudin sapien vitae felis vehicula, vel sollicitudin dui facilisis1' :
                tab === '002' ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet sapien non arcu volutpat tincidunt. Curabitur vestibulum malesuada orci vel suscipit. Nullam a erat sed purus gravida mollis. Phasellus sollicitudin sapien vitae felis vehicula, vel sollicitudin dui facilisis2' :
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet sapien non arcu volutpat tincidunt. Curabitur vestibulum malesuada orci vel suscipit. Nullam a erat sed purus gravida mollis. Phasellus sollicitudin sapien vitae felis vehicula, vel sollicitudin dui facilisis3'
              }
            </motion.p>
          </motion.div>
        </div>
      ))}
    </section>
  );

  const renderMobileLayout = () => (
    <section className='no-content'>
      {tabs.map((tab) => (
        <div className='no-card' key={tab}>
          <img src={`/assets/${tab}ss.webp`} alt={`${tab} icon`} className='no-card-image' />
          <div className='no-card-details'>
            <h2>
              {tab === '001' ? 'zero zero one' : tab === '002' ? 'zero zero two' : 'zero zero three'}
            </h2>
            <p>
              {
                tab === '001' ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet sapien non arcu volutpat tincidunt. Curabitur vestibulum malesuada orci vel suscipit. Nullam a erat sed purus gravida mollis. Phasellus sollicitudin sapien vitae felis vehicula, vel sollicitudin dui facilisis1' :
                tab === '002' ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet sapien non arcu volutpat tincidunt. Curabitur vestibulum malesuada orci vel suscipit. Nullam a erat sed purus gravida mollis. Phasellus sollicitudin sapien vitae felis vehicula, vel sollicitudin dui facilisis2' :
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet sapien non arcu volutpat tincidunt. Curabitur vestibulum malesuada orci vel suscipit. Nullam a erat sed purus gravida mollis. Phasellus sollicitudin sapien vitae felis vehicula, vel sollicitudin dui facilisis3'
              }
            </p>
          </div>
        </div>
      ))}
    </section>
  );

  return (
    <div className='no-tab-container'>
      {!isMobile && (
        <div className='no-index-container'>
          <div className='no-index'>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => goTo(tab)}
                className={active === tab ? 'active' : ''}
              >
                {tab.toUpperCase()}
              </button>
            ))}
            <div className='no-tab-indicator' style={indicatorStyle} />
          </div>
        </div>
      )}
      {isMobile ? renderMobileLayout() : renderDesktopLayout()}
    </div>
  );
}

export default Section;



// style for this section:



// .no-tab-container{
//   background-color: #000000;
//   width: 100%;
//   height: 100%;
//   color: #d4d4d4;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   position: relative;
//   }
//   .no-index-container{
//     background-color: #6e5c5c00;
//     width: 100%;
//     position: sticky;
//     display: flex;
//     justify-content: center;
//     top: 7.5%;
//   }
//   .no-index {
//     width: 30%;
//     position: relative;
//     display: flex;
//     justify-content:space-around;
//   }
  
//   .no-index button {
//     font-size: var(--fs-s);
//     padding: 1em 2em;
//     border: none;
//     text-align: center;
//     color: #ffffff;
//     background-color: #00000000;
//     position: relative;
//     cursor: pointer;
    
//   }
  
  
  
  
//   .no-tab-indicator {
//     position: absolute;
//     bottom: 0;
//     left: 0;
//     height: .2em;
//     border-radius: 2em;
//     transition: left .4s linear, width 0.4s linear; 
//     background: #03cdff;
//   }
  
  
//   .no-tab-indicator.active {
//     left: var(--left);
//     width: var(--width);
//   }
  
//   .no-content {
//     width: 99vw; 
//     height: 100%; /* Adjusted to fill the viewport height */
//     display: flex;
//     flex-direction: column;
//     /* padding: 1rem 13rem; */
//     justify-content: flex-start; /* Changed to align content to the start */
//   }
//   .no-box {
//     display: flex;
//     height: 100vh;
 
//     scroll-snap-align: start; 
//     background-position: center;
//     background-repeat: no-repeat;
//     background-size: cover;
//     background-attachment: fixed;
//     flex-direction: row-reverse;
//     transition: all  5s cubic-bezier(0.55, 0.055, 0.675, 0.19);
//   }
//   .no-001 {
//       background-image: url('/assets/1.png' );
//   }
//   .no-002{
//       flex-direction: row;
//     background-image: url('/assets/2.png' );
//   }
//   .no-003{
//     background-image: url('/assets/3.png' );
//   }
  
  
//   .no-box-details{
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
    
//     height: 99vh;
//     width: 50vw;
//     padding: 0em 7em;
//     margin: 0em 6em ;
//   }
  
//   .no-box-details h2{

//       color: #03cdff;
//   }
  
  
  
  
//   @media screen and (max-width: 767px) {
//     .no-content{
//       width: 99vw;
//       padding: 0em 1em;
//     }
//     .no-card-image{
//       width: 100%;
//       object-fit: contain;
//     }
//     .no-card-details h2{
//       font-size: var(--fs-s);
//     }
//     .no-card-details p{
//       font-size: var(--fs-xs);
//       text-align: justify;
//     }
  
//     .no-tab-container {
//       padding: 0 1rem;
//     }
    
//     .no-index {
//       width: 90%;
//     }
  
//     .no-index button {
//       font-size: 14px;
//       padding: 0.5em 1em;
//     }
  
//     .no-content {
//       width: 100vw;
//     }
  
//     .no-box {
//       flex-direction: column;
//       height: auto;
//       padding: 1em;
//       background-attachment: scroll;
//     }
  
//     .no-box-details {
//       width: 100%;
//       padding: 1em;
//       margin: 0;
//       height: auto;
//     }
  
   
//   }
  
//   @media screen and (min-width: 768px) and (max-width: 1024px) {
//     .no-tab-container {
//       padding: 0 2rem;
//     }
    
//     .no-index {
//       width: 80%;
//     }
  
//     .no-index button {
//       font-size: 1rem;
//       padding: 0.8em 1.5em;
//     }
  
//     .no-content {
//       width: 100vw;
//     }
  
//     .no-box {
//       flex-direction: row;
//       height: auto;
//       padding: 2em;
//       background-attachment: scroll;
//     }
  
//     .no-box-details {
//       width: 100%;
//       padding: 2em;
//       margin: 0;
//     }
  
  
//   }
  