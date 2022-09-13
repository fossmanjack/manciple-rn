// CarouselComponent.js
// Provides <Carousel>
// Couldn't find one I liked so made this from scratch

// React, RN, RNE, Redux
import { useState } from 'react';
import {
	Image,
	Pressable,
	View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon } from 'react-native-elements';

// Expo
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as MediaLibrary from 'expo-media-library';

// Community
import Dialog from 'react-native-dialog';

// Local
import * as Lists from '../slices/listsSlice';
import * as Istore from '../slices/itemStoreSlice';
import * as Utils from '../utils/utils';

export default function Carousel(props) {
	const { item, height, width, _Xstate } = props;
	const { dispatch } = _Xstate.funs;
	const { id: itemID, images: pics } = item;

	const [ currentImgIndex, setCurrentImgIndex ] = useState(0);
	const [ visible, setVisible ] = useState(false);

// these can be set as callback functions directly in the buttons
// so do that when you refactor

	const handleIncrement = _ => {
		const idx = currentImgIndex < pics.length - 1 ? currentImgIndex + 1 : 0;

		console.log('handleIncrement:', idx);
		setCurrentImgIndex(idx);
	}

	const handleDecrement = _ => {
		const idx = currentImgIndex > 0 ? currentImgIndex - 1 : pics.length - 1;

		console.log('handleDecrement:', idx);
		setCurrentImgIndex(idx);
	}

/*
	const handleDelete = _ => {
		console.log('handleDelete', itemID, currentImgIndex);

		const images = [ ...pics ];
		images.splice(currentImgIndex, 1);

		dispatch(Pantry.updateItem({
			itemID,
			updatedItem: {
				...item,
				images
			}
		}));
	}
*/
	const handleDelete = _ => {
		dispatch(Istore.deleteImage([ itemID, currentImgIndex ]));
	}

	const getImageFromGallery = async _ => {
		const perms = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if(perms.status === 'granted') {
			const capturedImage = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				aspect: [ 1, 1 ]
			});
			if(!capturedImage.cancelled) {
				processImage(capturedImage.uri);
			}
		}
	}

	const getImageFromCamera = async _ => {
		const perms = await ImagePicker.requestCameraPermissionsAsync();

		if(perms.status === 'granted') {
			const capturedImage = await ImagePicker.launchCameraAsync({
				allowsEditing: true,
				aspect: [ 1, 1 ]
			});
			if(!capturedImage.cancelled) {
				processImage(capturedImage.uri);
			}
		}
	}

	const processImage = async uri => {
		const processedImage = await ImageManipulator.manipulateAsync(
			uri,
			[ { resize: { width: 400 } } ],
			{
				compress: 0.4,
				format: ImageManipulator.SaveFormat.PNG,
				base64: true
			}
		);

		const imgData = 'data:image/png;base64,' + processedImage.base64;
		const savedImage = await MediaLibrary.saveToLibraryAsync(processedImage.uri);
		dispatch(Istore.addImage([ itemID, imgData ]));
		setVisible(false);
	}

	return (
		<>
			<View style={{
				justifyContent: 'center',
				alignItems: 'center',
				flex: 1,
			}}>
				{ pics.length > 0 && (
					<>
						<Image
							source={{ uri: pics[currentImgIndex] }}
							style={{
								width,
								height
							}}
							key={currentImgIndex}
						/>
						<View style={{ flexDirection: 'row' }}>
							<Button
								icon={
									<Icon
										name='chevron-left'
										type='font-awesome'
										color='white'
									/>
								}
								disabled={pics.length < 2}
								color='royalblue'
								onPress={handleDecrement}
							/>
							{
								mode === 'list' && (
									<Button
										icon={
											<Icon
												name='camera-plus'
												type='material-community'
												color='white'
											/>
										}
										color='green'
										onPress={_ => setVisible(true)}
									/>
								) || (
									<Button
										icon={
											<Icon
												name='x'
												type='foundation'
												color='white'
											/>
										}
										color='red'
										onPress={handleDelete}
									/>
								)
							}
							<Button
								icon={
									<Icon
										name='chevron-right'
										type='font-awesome'
										color='white'
									/>
								}
								disabled={pics.length < 2}
								color='royalblue'
								onPress={handleIncrement}
							/>
						</View>
					</>
					) || (
					<Pressable onPress={_ => setVisible(true)}>
					<Icon
						size={100}
						style={{
							padding: 40,
							margin: 10,
							borderWidth: 3,
							borderColor: 'royalblue',
							borderRadius: 20
						}}
						name='camera-plus'
						type='material-community'
						color='royalblue'
					/>
					</Pressable>
				)}
			</View>
			<Dialog.Container
				visible={visible}
			>
				<Dialog.Title>
					Add Photo
				</Dialog.Title>
				<Dialog.Button
					label='Camera'
					icon={
						<Icon
							name='camera-plus'
							type='material-community'
						/>
					}
					onPress={getImageFromCamera}
				/>
				<Dialog.Button
					label='Gallery'
					onPress={getImageFromGallery}
				/>
				<Dialog.Button
					label='Cancel'
					onPress={_ => setVisible(false)}
					icon={
						<Icon
							name='x'
							type='foundation'
						/>
					}
				/>
			</Dialog.Container>
		</>
	);
}

/* Notes

So the center button should switch to "delete photo" on mode change, so add
the conditional after you get the take photos up and running

						<Button
							icon={
								<Icon
									name='camera-plus'
									type='material-community'
									color='white'
								/>
							}
							color='green'
							onPress={_ => setVisible(true)}
						/>

					<>
						<Pressable onPress={_ => setVisible(true)}>
							<Image
								source={{ uri: _DefaultImage }}
								style={{
									width,
									height
								}}
							/>
						</Pressable>
					</>
*/
