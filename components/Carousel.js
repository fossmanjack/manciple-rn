import { useState } from 'react';
import { Image, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import * as Utils from '../utils/utils';
import { _DefaultImage } from '../res/_DefaultImage';

export default function Carousel(props) {
	const { pics, height, width } = props;
	const { currentImgIndex, setCurrentImgIndex } = useState(0);

	console.log('Carousel:', pics[0]);
	return (
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
						/>
						<Button
							icon={
								<Icon
									name='camera-plus'
									type='material-community'
									color='white'
								/>
							}
							color='green'
						/>
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
						/>
					</View>
				</>
				) || (
				<Image
					source={{ uri: _DefaultImage }}
					style={{
						width,
						height
					}}
				/>
			)}
		</View>
	);
}
