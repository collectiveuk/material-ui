import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { withStyles, useTheme } from '@material-ui/core/styles';
import NProgress from 'nprogress';
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiLink from '@material-ui/core/Link';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Tooltip from '@material-ui/core/Tooltip';
import NProgressBar from '@material-ui/docs/NProgressBar';
import FormatTextdirectionLToR from '@material-ui/icons/FormatTextdirectionLToR';
import FormatTextdirectionRToL from '@material-ui/icons/FormatTextdirectionRToL';
import Link from 'docs/src/modules/components/Link';
import AppDrawer from 'docs/src/modules/components/AppDrawer';
import MarkdownLinks from 'docs/src/modules/components/MarkdownLinks';
import { useChangeTheme } from 'docs/src/modules/components/ThemeContext';
import PageContext from 'docs/src/modules/components/PageContext';

const AppSearch = React.lazy(() => import('docs/src/modules/components/AppSearch'));
function DeferredAppSearch() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <React.Fragment>
      <link
        rel="preload"
        href="https://cdn.jsdelivr.net/docsearch.js/2/docsearch.min.css"
        as="style"
      />
      {/* Suspense isn't supported for SSR yet */}
      {mounted ? (
        <React.Suspense fallback={null}>
          <AppSearch />
        </React.Suspense>
      ) : null}
    </React.Fragment>
  );
}

const styles = (theme) => ({
  '@global': {
    '#main-content': {
      outline: 0,
    },
  },
  root: {
    display: 'flex',
    backgroundColor: theme.palette.background.level1,
  },
  grow: {
    flex: '1 1 auto',
  },
  skipNav: {
    position: 'fixed',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    transition: theme.transitions.create('top', {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.leavingScreen,
    }),
    left: theme.spacing(2),
    top: theme.spacing(-10),
    zIndex: theme.zIndex.tooltip + 1,
    '&:focus': {
      top: theme.spacing(2),
      transition: theme.transitions.create('top', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    '@media print': {
      display: 'none',
    },
  },
  appBar: {
    color: theme.palette.type === 'light' ? null : '#fff',
    backgroundColor: theme.palette.type === 'light' ? null : theme.palette.background.level2,
    transition: theme.transitions.create('width'),
  },
  language: {
    margin: theme.spacing(0, 0.5, 0, 1),
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  },
  appBarHome: {
    boxShadow: 'none',
  },
  appBarShift: {
    [theme.breakpoints.up('lg')]: {
      width: 'calc(100% - 240px)',
    },
  },
  drawer: {
    [theme.breakpoints.up('lg')]: {
      flexShrink: 0,
      width: 240,
    },
  },
  navIconHide: {
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  banner: {
    display: 'block',
    padding: 8,
    textAlign: 'center',
    backgroundColor:
      theme.palette.type === 'dark' ? theme.palette.background.paper : theme.palette.primary.dark,
    color: 'white',
  },
  bannerLink: {
    textDecoration: 'underline',
  },
});

function AppFrame(props) {
  const { children, classes, disableDrawer = false } = props;
  const theme = useTheme();
  const t = useSelector((state) => state.options.t);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setMobileOpen(true);
  };
  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const changeTheme = useChangeTheme();
  const handleToggleDirection = () => {
    changeTheme({ direction: theme.direction === 'ltr' ? 'rtl' : 'ltr' });
  };

  const { activePage } = React.useContext(PageContext);

  let disablePermanent = false;
  let navIconClassName = '';
  let appBarClassName = classes.appBar;

  if (activePage?.disableDrawer === true || disableDrawer === true) {
    disablePermanent = true;
    appBarClassName += ` ${classes.appBarHome}`;
  } else {
    navIconClassName = classes.navIconHide;
    appBarClassName += ` ${classes.appBarShift}`;
  }

  return (
    <div className={classes.root}>
      <NProgressBar />
      <CssBaseline />
      <MuiLink color="secondary" className={classes.skipNav} href="#main-content">
        {t('skipToContent')}
      </MuiLink>
      <MarkdownLinks />
      <AppBar className={appBarClassName}>
        <Typography variant="body2" className={classes.banner} noWrap>
          {t('v5IsOut')}{' '}
          <Link color="inherit" className={classes.bannerLink} href="https://next.material-ui.com">
            {t('v5docsLink')}
          </Link>{' '}
          {t('v5startAdoption')}
        </Typography>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label={t('openDrawer')}
            onClick={handleDrawerOpen}
            className={navIconClassName}
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.grow} />
          <DeferredAppSearch />
          <Tooltip title={t('toggleRTL')} key={theme.direction} enterDelay={300}>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleToggleDirection}
              aria-label={t('toggleRTL')}
              data-ga-event-category="header"
              data-ga-event-action="rtl"
            >
              {theme.direction === 'rtl' ? (
                <FormatTextdirectionLToR />
              ) : (
                <FormatTextdirectionRToL />
              )}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <AppDrawer
        className={disablePermanent ? '' : classes.drawer}
        disablePermanent={disablePermanent}
        onClose={handleDrawerClose}
        onOpen={handleDrawerOpen}
        mobileOpen={mobileOpen}
      />
      {children}
    </div>
  );
}

AppFrame.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
  disableDrawer: PropTypes.node,
};

export default withStyles(styles)(AppFrame);
