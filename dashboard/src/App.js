import "./index.css";
import "./styles/grid_style.css";
import "../node_modules/react-resizable/css/styles.css";
import React, { useEffect } from "react";
import {
	styled,
	useTheme,
	ThemeProvider,
	createTheme,
} from "@mui/material/styles";
import { WidthProvider, Responsive} from "react-grid-layout";
import { FormControl, Select, InputLabel, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ShapeLine, Edit, } from "@mui/icons-material";
import Modal from "@mui/material/Modal";
import ChartContainer from "./components/chartcontainer";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { Add, Clear } from "@mui/icons-material";
import CssBaseline from "@mui/material/CssBaseline";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Chip from '@mui/material/Chip';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { ColorPicker } from "material-ui-color";
import { Colours , Themes } from "./components/colours";
import Autocomplete from "@mui/material/Autocomplete";

const ResponsiveGridLayout = WidthProvider(Responsive);

const layout = [
	{ i: "0", x: 0, y: 0, w: 1, h: 2 },
	{ i: "1", x: 1, y: 0, w: 1, h: 2 },
	{ i: "2", x: 0, y: 1, w: 1, h: 2 },
	{ i: "3", x: 1, y: 1, w: 1, h: 2 },
	{ i: "4", x: 0, y: 2, w: 2, h: 2 },
];

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #EEE",
	boxShadow: 24,
	p: 4,
};

const drawerWidth = 240;

const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
});

const closedMixin = (theme) => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: "nowrap",
	boxSizing: "border-box",
	...(open && {
		...openedMixin(theme),
		"& .MuiDrawer-paper": openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		"& .MuiDrawer-paper": closedMixin(theme),
	}),
}));

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

const columns = [];
let all_data = {};

let columnsFetched = false;

function getFilters(filterList) {
	let address = "&";
	let firstFilter = true;
	console.log(filterList);

	filterList.forEach((f) => {
		if (f.current_selection.length === 0) {
			return;
		}

		console.log(filterList);

		if (!firstFilter) address = address + "&";
		address = address + `${f.name}=${f.current_selection}`;
		firstFilter = false;
	});

	return address;
}

let firstRun = true;


function App() {
	const chartsArray = [
		{
			id: 0,
			data: [],
			data_key: "",
			type: "",
		},
		{
			id: 1,
			data: [],
			data_key: "",
			type: "",
		},
	];
	const [ignored, forceUpdate] = React.useReducer((x) => x + 1, 0);

	const theme = useTheme();
	const colorMode = React.useContext(ColorModeContext);

	const [anchorEl, setAnchorEl] = React.useState(null);
	const [shape, setShape] = React.useState("");
	const [selectedData, setSelectedData] = React.useState("");
	const [chartId, setChartId] = React.useState(null);
	const [charts, setCharts] = React.useState(chartsArray);
	const [sideBarOpen, setSideBarOpen] = React.useState(false);
	const [changeShapeMenuOpen, setChangeShapeMenuOpen] = React.useState(false);
	const [changeDataScreenOpen, setChangeDataScreenOpen] = React.useState(false);
	const [changeColourScreenOpen, setChangeColourScreenOpen] = React.useState(false);
	const [addChartMenuOpen, setAddChartMenuOpen] = React.useState(false);
	const [filters, setFilters] = React.useState([]);
	// TODO: Make this work
	const [dashBoardSize, setDashBoardSize] = React.useState([300, 600]);

	React.useEffect(() => {
		window.addEventListener('resize', handleResize);    
		return () => {
			window.removeEventListener('resize', handleResize);
		}
	}, []);

	function handleResize() {
		setDashBoardSize([Math.round(window.innerWidth / 150), window.innerHeight]);
	}

	// TODO: Pull/save colour themes from db
	let cid = 0;
	let cp = [];
	Colours.forEach(c => {
		cp.push({key: cid++, colour: c});
	});
	const [colourPalette, setColourPalette] = React.useState(cp);
	const [colourTheme, setColourTheme] = React.useState("Default");

	let filterCount = 0;
	let filtersArray = [];
	if (!columnsFetched) {
		fetch("http://localhost:8081/dummy/columns")
			.then((res) => res.json())
			.then((data) =>
				data
					.filter((v) => v["COLUMN_NAME"] !== "id")
					.forEach((e) => {
						let opts = [];
						fetch(
							`http://localhost:8081/dummy/filters?column=${e["COLUMN_NAME"]}`,
						)
							.then((r) => r.json())
							.then((d) => {
								d.forEach((o) => {
									opts.push(o[e["COLUMN_NAME"]]);
								});
							})
							.catch((err) => console.log(err));

						opts = opts.sort(function (a, b) {
							if (a < b) {
								return -1;
							}
							if (a > b) {
								return 1;
							}
							return 0;
						});
						columns.push(e["COLUMN_NAME"]);
						filtersArray.push({
							id: ++filterCount,
							name: e["COLUMN_NAME"],
							options: opts,
							current_selection: [],
						});
					}),
			)
			.then((columnsFetched = true))
			.then(setFilters(filtersArray))
			.catch((err) => console.log(err));
	}

	let chartCount = 0;

	const changeType = (id, t) => {
		let ch = [...charts];
		let c = ch[id];
		c.type = t;
		ch[id] = c;
		setCharts(ch);
	};

	const changeData = (id, d) => {
		let ch = [...charts];
		let c = ch[id];
		let da = [];
		let dk = c.data_key;
		if (dk === "") {
			if (Object.keys(all_data).length > 0 && c.data_key === "") {
				console.log("loading default data");
				da = all_data[Object.keys(all_data)[1]];
				dk = Object.keys(all_data)[1];
			}
			// console.log(all_data[Object.keys(all_data)[1]]);
		} else {
			console.log("setting data");
			console.log(`dk ${dk}`);
			if (Object.keys(all_data).length > 0) {
				da = d === "same" ? all_data[dk] : all_data[d];
				dk = d === "same" ? dk : d;
			}
		}
		c.data_key = dk;
		c.data = da;
		ch[id] = c;
		setCharts(ch);
	};

	const handleColourPaletteChange = (event, key) => {
		let palette = [...colourPalette];
		let c = palette[key];
		c.colour = `#${event.hex}`;
		palette[key] = c;

		let i = 0;
		palette.forEach(pc => {
			Colours[i] = pc.colour;
			i++;
		});
		setColourPalette(palette);
	}

	const handleChangeButtonClicked = (event) => {
		if (shape === "") return;
		event.preventDefault();
		event.stopPropagation();
		changeType(chartId, shape);
	};

	const handleChangeDataButtonClicked = (event) => {
		if (selectedData === "") return;
		event.preventDefault();
		event.stopPropagation();
		changeData(chartId, selectedData);
	};

	const handleClick = (event) => {
		event.preventDefault();
		setAnchorEl(event.currentTarget);
		setChartId(event.currentTarget.children[0].id);
		// addChart(++chartCount, "radial", radialData);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleChangeShape = (event, shape) => {
		setShape(event.target.value);
	};

	const handleChangeData = (event, shape) => {
		setSelectedData(event.target.value);
	};

	const handleChangeFilters = (event, id) => {
		var object = [...filters];
		const {
			target: { value },
		} = event;
		setFilters(
			object.map((c) =>
				c.id === id ? { ...c, current_selection: typeof value === 'string' ? value.split(',') : value } : { ...c },
			),
		);
	};

	const handleFilterClearClick = (event, id) => {
		var object = [...filters];
		const {
			target: { value },
		} = event;
		setFilters(
			object.map((c) =>
				c.id === id ? { ...c, current_selection: [] } : { ...c },
			),
		);
	}

	const handleChangeColourTheme = (event, e2) => {
		
		console.log(e2);

		let new_theme = Themes.find(t => t.label === e2.label);

		if (new_theme === undefined)
			return;

		console.log(new_theme);

		let palette = [];
		let i = 0;
		new_theme.colours.forEach(c => {
			Colours[i] = c;
			palette.push({key: i, colour: c});
			i++;
		});

		console.log(palette);

		setColourTheme(e2.label);
		setColourPalette(palette);
	}

	const handleOpenChangeShapeScreen = (event) => {
		setAnchorEl(null);
		setChangeShapeMenuOpen(true);
	};
	const handleCloseChangeShapeScreen = (event) => {
		setAnchorEl(null);
		setChangeShapeMenuOpen(false);
	};
	const handleChangeDataScreenOpen = (event) => {
		setAnchorEl(null);
		setChangeDataScreenOpen(true);
	};
	const handleCloseChangeDataScreen = (event) => {
		setAnchorEl(null);
		setChangeDataScreenOpen(false);
	};
	const handleAddChartMenuOpen = (event) => {
		setAnchorEl(null);
		setAddChartMenuOpen(true);
	};
	const handleAddChartMenuClose = (event) => {
		setAnchorEl(null);
		setAddChartMenuOpen(false);
	};
	const handleChangeColourPaletteOpen = (event) => {
		setAnchorEl(null);
		setChangeColourScreenOpen(true);
	};
	const handleCloseChangeColourScreen = (event) => {
		setAnchorEl(null);
		setChangeColourScreenOpen(false);
	};

	const addChart = (e, id, t, data) => {
		var object = {
			id: id,
			data: [],
			type: t,
			dirty: true,
		};
		setCharts([...charts, object]);
	};

	const handleDrawerOpen = () => {
		setSideBarOpen(true);
	};

	const handleDrawerClose = () => {
		setSideBarOpen(false);
	};

	useEffect(() => {
		console.log("fetching data...");
		all_data.length = 0;

		columns.forEach((c) => {
			let tmp = [];
			fetch("http://localhost:8081/dummy/get?select=" + c + getFilters(filters))
				.then((res) => res.json())
				.then((data) =>
					data.forEach((e) => {
						tmp.push({ name: e[c], value: e["count"] });
					}),
				)
				.then((firstRun = false))
				.catch((err) => console.log(err));
			all_data[c] = tmp;
		});

		setTimeout(() => charts.forEach((c) => changeData(c.id, "same")), 1000);
	}, [filters]);

	if (firstRun) {
		setTimeout(() => {
			console.log("fetching data...");
			all_data.length = 0;

			columns.forEach((c) => {
				let tmp = [];
				fetch(
					"http://localhost:8081/dummy/get?select=" + c + getFilters(filters),
				)
					.then((res) => res.json())
					.then((data) =>
						data.forEach((e) => {
							tmp.push({ name: e[c], value: e["count"] });
						}),
					)
					.then((firstRun = false))
					.catch((err) => console.log(err));
				all_data[c] = tmp;
			});

			setTimeout(() => charts.forEach((c) => changeData(c.id, "same")), 1000);
			setTimeout(() => charts.forEach((c) => changeType(c.id, "bar")), 1000);
			setTimeout(() => forceUpdate(), 1000);
		}, 1000);
	}


	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBar position="fixed" open={sideBarOpen}>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						sx={{
							marginRight: 5,
							...(sideBarOpen && { display: "none" }),
						}}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap component="div">
						Education Dashboard
					</Typography>
					<IconButton
						sx={{ ml: 1 }}
						onClick={colorMode.toggleColorMode}
						color="inherit"
						align="right"
					>
						{theme.palette.mode === "dark" ? (
							<Brightness7Icon />
						) : (
							<Brightness4Icon />
						)}
					</IconButton>
				</Toolbar>
			</AppBar>
			<Drawer variant="permanent" open={sideBarOpen}>
				<DrawerHeader>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === "rtl" ? (
							<ChevronRightIcon />
						) : (
							<ChevronLeftIcon />
						)}
					</IconButton>
				</DrawerHeader>
				<Divider />
				<List>
					<ListItem key="a" disablePadding sx={{ display: "block" }}>
						<ListItemButton
							sx={{
								minHeight: 48,
								justifyContent: sideBarOpen ? "initial" : "center",
								px: 2.5,
							}}
							onClick={handleAddChartMenuOpen}
						>
							<ListItemIcon
								sx={{
									minWidth: 0,
									mr: sideBarOpen ? 3 : "auto",
									justifyContent: "center",
								}}
							>
								<Add />
							</ListItemIcon>
							<ListItemText
								primary="Create chart"
								sx={{ opacity: sideBarOpen ? 1 : 0 }}
							/>
						</ListItemButton>
					</ListItem>
					<ListItem key="b" disablePadding sx={{ display: "block" }}>
						<ListItemButton
							sx={{
								minHeight: 48,
								justifyContent: sideBarOpen ? "initial" : "center",
								px: 2.5,
							}}
							onClick={handleChangeColourPaletteOpen}
						>
							<ListItemIcon
								sx={{
									minWidth: 0,
									mr: sideBarOpen ? 3 : "auto",
									justifyContent: "center",
								}}
							>
								<ColorLensIcon />
							</ListItemIcon>
							<ListItemText
								primary="Change colours"
								sx={{ opacity: sideBarOpen ? 1 : 0 }}
							/>
						</ListItemButton>
					</ListItem>
				</List>
			</Drawer>
			<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
				<DrawerHeader />
				{filters.map((f) => (
					<FormControl sx={{m: 1, minWidth: 160}}>
						<InputLabel id={f.name}>{f.name}</InputLabel>
						<Select
							autoWidth={true}
							labelId={f.name}
							value={f.current_selection}
							label={f.name}
							onChange={(e) => {
								handleChangeFilters(e, f.id);
							}}
							multiple
							sx={{"& .MuiSelect-iconOutlined": {display: f.current_selection.length > 0 ? 'none': ''}, "&.Mui-focused .MuiIconButton-root": {color: 'primary.main'}}}
							renderValue={(selected) => (
								<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
									{selected.map((value) => (
										<Chip key={value} label={value} />
									))}
								</Box>)}
							endAdornment={<IconButton sx={{display: f.current_selection.length > 0 ? "": "none"}} onClick={(e) => handleFilterClearClick(e, f.id)}><Clear/></IconButton>}
						>
							{f.options.map((o) => (
								<MenuItem key={o} value={o}>
									{o}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				))}
				<ResponsiveGridLayout
					className="grid"
					layout={layout}        
					cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
					breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
					rows={3}
					rowHeight={150}
					//TODO: Make width dynamically change based on window size.
				>
					{charts.map((c, idx) => (
						<div
							key={chartCount++}
							className="layoutItem"
							onContextMenu={handleClick}
						>
							<ChartContainer
								id={idx}
								data={c.data}
								type={c.type}
								data_key={c.data_key}
							/>
						</div>
					))}
				</ResponsiveGridLayout>
				<Menu
					id="customized-menu"
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleClose}
				>
					<MenuItem onClick={handleOpenChangeShapeScreen}>
						<ListItemIcon>
							<ShapeLine fontSize="small" />
						</ListItemIcon>
						<ListItemText primary="Change Shape" />
					</MenuItem>
					<MenuItem onClick={handleChangeDataScreenOpen}>
						<ListItemIcon>
							<Edit fontSize="small" />
						</ListItemIcon>
						<ListItemText primary="Edit" />
					</MenuItem>
				</Menu>
				<Modal
					open={changeShapeMenuOpen}
					onClose={handleCloseChangeShapeScreen}
				>
					<Box sx={style}>
						<div className="content">
							<FormControl fullWidth>
								<InputLabel>Shape</InputLabel>
								<Select
									labelId="shape-select-label"
									id="shape-select"
									value={shape}
									label="Shape"
									onChange={handleChangeShape}
								>
									<MenuItem value={"bar"}>Bar</MenuItem>
									<MenuItem value={"line"}>Line</MenuItem>
									<MenuItem value={"radar"}>Radar</MenuItem>
									<MenuItem value={"pie"}>Pie</MenuItem>
									<MenuItem value={"area"}>Area</MenuItem>
								</Select>
								<Button onClick={handleChangeButtonClicked}>Change</Button>
							</FormControl>
						</div>
					</Box>
				</Modal>
				<Modal open={addChartMenuOpen} onClose={handleAddChartMenuClose}>
					<Box sx={style}>
						<div className="content">
							<FormControl fullWidth>
								<InputLabel>Shape</InputLabel>
								<Select
									labelId="shape-select-label"
									id="shape-select"
									value={shape}
									label="Add Chart"
									onChange={handleChangeShape}
								>
									<MenuItem value={"bar"}>Bar</MenuItem>
									<MenuItem value={"line"}>Line</MenuItem>
									<MenuItem value={"radar"}>Radar</MenuItem>
									<MenuItem value={"pie"}>Pie</MenuItem>
									<MenuItem value={"area"}>Area</MenuItem>
								</Select>
								<Button onClick={(e) => addChart(e, chartCount++, shape, [])}>
									Add
								</Button>
							</FormControl>
						</div>
					</Box>
				</Modal>
				<Modal
					open={changeDataScreenOpen}
					onClose={handleCloseChangeDataScreen}
				>
					<Box sx={style}>
						<div className="content">
							<FormControl fullWidth>
								<InputLabel>Data</InputLabel>
								<Select
									labelId="data-select-label"
									id="data-select"
									value={selectedData}
									label="Data"
									onChange={handleChangeData}
								>
									{columns.map((c) => (
										<MenuItem value={c}>{c}</MenuItem>
									))}
								</Select>
								<Button onClick={handleChangeDataButtonClicked}>Change</Button>
							</FormControl>
						</div>
					</Box>
				</Modal>
				<Modal
					open={changeColourScreenOpen}
					onClose={handleCloseChangeColourScreen}
				>
					<Box sx={style}>
						<div className="content">
							<FormControl fullWidth>
								<Autocomplete
									labelId="colour-theme-select-label"
									id="colour-theme-select"
									label="Theme"
									onChange={handleChangeColourTheme}
									options={Themes}
									value={colourTheme}
									renderInput={(params) => <TextField {...params} label="Theme" />}
								>
									{/* {Themes.map((t) => (
										<MenuItem value={t.name}>{t.name}</MenuItem>
									))} */}
								</Autocomplete>
							</FormControl>
							<h2 align="center">Customise</h2>
							<FormControl fullWidth>
								<b>Theme name</b>
								<TextField value={colourTheme}>asd</TextField>
							</FormControl>
							<br />
							<br />
							{
								colourPalette.map((c) => (
									<FormControl fullWidth>
										<b>Chart colour {c.key}</b>
										<ColorPicker key={c.key} value={c.colour} onChange={(e) => handleColourPaletteChange(e, c.key)}/>
									</FormControl>
								))
							}
							<FormControl fullWidth>
								<Button>Save Theme</Button>
							</FormControl>
						</div>
					</Box>
				</Modal>
			</Box>
		</Box>
	);
}

export default function ToggleColorMode() {
	const [mode, setMode] = React.useState("light");
	const colorMode = React.useMemo(
		() => ({
			toggleColorMode: () => {
				setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
			},
		}),
		[],
	);

	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode,
				},
			}),
		[mode],
	);

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<App />
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}