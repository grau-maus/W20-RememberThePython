import React, { useState } from "react";
import { ReactSVG } from "react-svg";
import { useSelector, useDispatch } from "react-redux";
import { Nav, Button, Tab, Col, Row } from "react-bootstrap";
import { getAllLists, deleteList } from "../../store/lists";
import EditListModal from "../EditListModal";
import ListModal from "../../components/ListModal";
import AllTasks from "./allTasks";
import Logo from "./Logo";
import { getTasks, clearAllTasks, getListTasks } from "../../store/tasks";
import { clearAllResults } from "../../store/search";
import { resetCheckboxState } from "../../store/checkboxes";
import Hometab from "../Hometab";
import * as listActions from "../../store/lists";
import { searchDateQuery } from "../../store/search";

import styles from "./SideNavigation.module.css";
import "./SideNavigation.css";
import trashIcon from "../../images/icons/font-awesome/trash-alt-regular.svg";

const SideNavigation = () => {
	const dispatch = useDispatch();
	const sessionUser = useSelector((state) => state.session.user);
	const lists = useSelector((state) => state.lists.allLists);
	const [listLoaded, setListLoaded] = useState(false);
	const [tasksLoaded, setTasksLoaded] = useState(false);

	const handleDelete = async (e) => {
		e.preventDefault();
		const toBeDeleted = {
			listId: e.target.id,
		};
		await dispatch(deleteList(toBeDeleted));
		await dispatch(getAllLists());
	};

	const loadTasks = async (list) => {
		await dispatch(resetCheckboxState());

		if (list !== "search" && tasksLoaded === false) {
			setTasksLoaded(true);
			await dispatch(clearAllTasks());
			await dispatch(clearAllResults());
		}

		switch (list) {
			case "home":
				if (!listLoaded) {
					setListLoaded(true);
					await dispatch(listActions.getAllLists());
				}
				return;
			case "allTasks":
				await dispatch(getTasks());
				setListLoaded(false);
				setTasksLoaded(false);
				return;
			case "today":
				(async () => await dispatch(searchDateQuery("Today")))();
				setListLoaded(false);
				setTasksLoaded(false);
				return;
			case "tomorrow":
				(async () => await dispatch(searchDateQuery("Tomorrow")))();
				setListLoaded(false);
				setTasksLoaded(false);
				return;
			case "thisWeek":
				(async () => await dispatch(searchDateQuery("ThisWeek")))();
				setListLoaded(false);
				setTasksLoaded(false);
				return;
			// case "trash":
			// 	setListLoaded(false);
			// 	setTasksLoaded(false);
			// 	return;
			default:
				if (list === "search") return;
				const [currentList] = lists.filter((singleList) => singleList.title === list);
				await dispatch(getListTasks(currentList.id));
				setListLoaded(false);
				setTasksLoaded(false);
				return;
		}
	};

	if (!sessionUser || !lists) return null;
	return (
		<Tab.Container id="sideNav" defaultActiveKey="first">
			<Row>
				<Col sm={1.5} className={styles.tabContainer}>
					<Logo />
					<Nav variant="pills" className="flex-column">
						<Nav.Item className={styles.navItem}>
							<Nav.Link onClick={() => loadTasks("home")} eventKey="home">
								Home
							</Nav.Link>
						</Nav.Item>
						<Nav.Item className={styles.navItem}>
							<Nav.Link onClick={() => loadTasks("allTasks")} eventKey="allTasks">
								All Tasks
							</Nav.Link>
						</Nav.Item>
						<Nav.Item className={styles.navItem}>
							<Nav.Link onClick={() => loadTasks("today")} eventKey="today">
								Due Today
							</Nav.Link>
						</Nav.Item>
						<Nav.Item className={styles.navItem}>
							<Nav.Link onClick={() => loadTasks("tomorrow")} eventKey="tomorrow">
								Due Tomorrow
							</Nav.Link>
						</Nav.Item>
						<Nav.Item className={styles.navItem}>
							<Nav.Link onClick={() => loadTasks("thisWeek")} eventKey="thisWeek">
								Due Within a Week
							</Nav.Link>
						</Nav.Item>
						{/* <Nav.Item className={styles.navItem}>
							<Nav.Link onClick={() => loadTasks("trash")} eventKey="trash">
								Trash
							</Nav.Link>
						</Nav.Item> */}
						<Nav.Item className={styles.navItem}>
							<Nav.Link onClick={() => loadTasks("search")} eventKey="search">
								Search
							</Nav.Link>
						</Nav.Item>
						<div className={styles.list_div}>
							<h3>Lists</h3>
							<ListModal />
						</div>
						<div className={styles.lists_container} id="lists_container">
							{lists?.map((lis) => (
								<Nav.Item key={lis.id} className={`${styles.list_div} ${styles.navItem}`}>
									<Nav.Link onClick={() => loadTasks(`${lis.title}`)} eventKey={lis.id} className={styles.listName}>
										{lis.title}
									</Nav.Link>
									<div className={styles.editBtn}>
										<EditListModal title={lis.title} id={lis.id} />
									</div>
									<Button id={lis.id} onClick={handleDelete} className={`${styles.deleteBtn}`}>
										<ReactSVG src={trashIcon} wrapper="svg" id={`trash-${lis.id}`} className={"trash-icon"} />
									</Button>
								</Nav.Item>
							))}
						</div>
					</Nav>
				</Col>
				<Col sm={8} id="tabs-center">
					<Tab.Content>
						<Tab.Pane eventKey="home">
							<Hometab listLoaded={listLoaded} />
						</Tab.Pane>
						<Tab.Pane eventKey="allTasks">
							<AllTasks listId={0} />
						</Tab.Pane>
						<Tab.Pane eventKey="today">
							<AllTasks listId={-1} />
						</Tab.Pane>
						<Tab.Pane eventKey="tomorrow">
							<AllTasks listId={-1} />
						</Tab.Pane>
						<Tab.Pane eventKey="thisWeek">
							<AllTasks listId={-1} />
						</Tab.Pane>
						{/* <Tab.Pane eventKey="trash">
							<p> test</p>
						</Tab.Pane> */}
						{lists?.map((lis) => (
							<Tab.Pane eventKey={lis.id} key={lis.id}>
								<AllTasks listId={lis.id} />
							</Tab.Pane>
						))}
						<Tab.Pane eventKey="search">
							{/* -1 VALUE TO REPRESENT DISPLAYING SEARCH RESULTS IN COMPONENT */}
							<AllTasks listId={-1} />
						</Tab.Pane>
					</Tab.Content>
				</Col>
			</Row>
		</Tab.Container>
	);
};

export default SideNavigation;
