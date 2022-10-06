import React from "react";
import * as I from "csgogsi-socket";
import Weapon from "./../Weapon/Weapon";
import Avatar from "./Avatar";
import Armor from "./../Indicators/Armor";
import Bomb from "./../Indicators/Bomb";
import Defuse from "./../Indicators/Defuse";

interface IProps {
  player: I.Player,
  isObserved: boolean,
}

const compareWeapon = (weaponOne: I.WeaponRaw, weaponTwo: I.WeaponRaw) => {
  if (weaponOne.name === weaponTwo.name &&
    weaponOne.paintkit === weaponTwo.paintkit &&
    weaponOne.type === weaponTwo.type &&
    weaponOne.ammo_clip === weaponTwo.ammo_clip &&
    weaponOne.ammo_clip_max === weaponTwo.ammo_clip_max &&
    weaponOne.ammo_reserve === weaponTwo.ammo_reserve &&
    weaponOne.state === weaponTwo.state
  ) return true;

  return false;
}

const compareWeapons = (weaponsObjectOne: { [key: string]: I.WeaponRaw }, weaponsObjectTwo: { [key: string]: I.WeaponRaw }) => {
  const weaponsOne = Object.values(weaponsObjectOne).sort((a, b) => (a.name as any) - (b.name as any))
  const weaponsTwo = Object.values(weaponsObjectTwo).sort((a, b) => (a.name as any) - (b.name as any))

  if (weaponsOne.length !== weaponsTwo.length) return false;

  return weaponsOne.every((weapon, i) => compareWeapon(weapon, weaponsTwo[i]));
}

const arePlayersEqual = (playerOne: I.Player, playerTwo: I.Player) => {
  if (playerOne.name === playerTwo.name &&
    playerOne.steamid === playerTwo.steamid &&
    playerOne.observer_slot === playerTwo.observer_slot &&
    playerOne.defaultName === playerTwo.defaultName &&
    playerOne.clan === playerTwo.clan &&
    playerOne.stats.kills === playerTwo.stats.kills &&
    playerOne.stats.assists === playerTwo.stats.assists &&
    playerOne.stats.deaths === playerTwo.stats.deaths &&
    playerOne.stats.mvps === playerTwo.stats.mvps &&
    playerOne.stats.score === playerTwo.stats.score &&
    playerOne.state.health === playerTwo.state.health &&
    playerOne.state.armor === playerTwo.state.armor &&
    playerOne.state.helmet === playerTwo.state.helmet &&
    playerOne.state.defusekit === playerTwo.state.defusekit &&
    playerOne.state.flashed === playerTwo.state.flashed &&
    playerOne.state.smoked === playerTwo.state.smoked &&
    playerOne.state.burning === playerTwo.state.burning &&
    playerOne.state.money === playerTwo.state.money &&
    playerOne.state.round_killhs === playerTwo.state.round_killhs &&
    playerOne.state.round_kills === playerTwo.state.round_kills &&
    playerOne.state.round_totaldmg === playerTwo.state.round_totaldmg &&
    playerOne.state.equip_value === playerTwo.state.equip_value &&
    playerOne.state.adr === playerTwo.state.adr &&
    playerOne.avatar === playerTwo.avatar &&
    playerOne.country === playerTwo.country &&
    playerOne.realName === playerTwo.realName &&
    compareWeapons(playerOne.weapons, playerTwo.weapons)
  ) return true;

  return false;
}

const Player = ({ player, isObserved }: IProps) => {

  const weapons = Object.values(player.weapons).map(weapon => ({ ...weapon, name: weapon.name.replace("weapon_", "") }));
  const primary = weapons.filter(weapon => !['C4', 'Pistol', 'Knife', 'Grenade', undefined].includes(weapon.type))[0] || null;
  const secondary = weapons.filter(weapon => weapon.type === "Pistol")[0] || null;
  const grenades = weapons.filter(weapon => weapon.type === "Grenade");
  const isLeft = player.team.orientation === "left";
  return (
    <div className={`player ${player.state.health === 0 ? "dead" : ""} ${isObserved ? 'active' : ''}`}>
      <div className="player_data">
        <Avatar steamid={player.steamid} height={57} width={57} showSkull={true} showCam={false} sidePlayer={true} />
        <div className="dead-stats">
          <div className="values">
            <div className="stat-label">K</div>
            <div className="stat-value">{player.stats.kills}</div>
            <div className="stat-label">A</div>
            <div className="stat-value">{player.stats.assists}</div>
            <div className="stat-label">D</div>
            <div className="stat-value">{player.stats.deaths}</div>
          </div>
        </div>
        <div className="alive-stats">
          <div className="values">
            <div className="stat-label">K</div>
            <div className="stat-value">{player.stats.kills}</div>
            <div className="stat-label">A</div>
            <div className="stat-value">{player.stats.assists}</div>
            <div className="stat-label">D</div>
            <div className="stat-value">{player.stats.deaths}</div>
          </div>
        </div>
        <div className="player_stats">
          <div className="row">
            <div className="health">
              {player.state.health}
              </div>
            {player.state.round_kills ? <div className="roundkills-container-dead">{player.state.round_kills}</div> : null}
            {player.state.round_kills ? <div className="roundkills-container">{player.state.round_kills}</div> : null}
            <div className="username">
              <div>{player.name}</div>
            </div>
          </div>
          <div className={`hp_bar ${player.state.health <= 20 ? 'low' : ''}`} style={{ width: `${player.state.health}%` }}></div>
          <div className="row">
            <div className="number">
              <div className="num">{player.observer_slot}</div>
            </div>
            <div className="armor">
              <Armor player={player} />
            </div>
            <div className="bomb">
              <Bomb player={player} />
            </div>
            <div className="defuser">
              <Defuse player={player} />
            </div>
            <div className="money">${player.state.money}</div>
            <div className="money-dead">${player.state.money}</div>
            <div className="grenade_container">
						{grenades.map(grenade => <React.Fragment key={`${player.steamid}_${grenade.name}_${grenade.ammo_reserve || 1}`}>
							<Weapon weapon={grenade.name} active={grenade.state === "active"} isGrenade />
							{
								grenade.ammo_reserve === 2 ? <Weapon weapon={grenade.name} active={grenade.state === "active"} isGrenade /> : null}
						</React.Fragment>)}
					</div>
            <div className="secondary_weapon">{primary && secondary ? <Weapon weapon={secondary.name} active={secondary.state === "active"} /> : ""}</div>
            {primary || secondary ? <Weapon weapon={primary ? primary.name : secondary.name} active={primary ? primary.state === "active" : secondary.state === "active"} /> : ""}
          </div>
          <div className="active_border"></div>
        </div>
      </div>
    </div>
  );
}

const arePropsEqual = (prevProps: Readonly<IProps>, nextProps: Readonly<IProps>) => {
  if (prevProps.isObserved !== nextProps.isObserved) return false;

  return arePlayersEqual(prevProps.player, nextProps.player);
}

export default React.memo(Player, arePropsEqual);
